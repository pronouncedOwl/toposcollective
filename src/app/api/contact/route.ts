import { NextRequest, NextResponse } from 'next/server';
import { sendSMTP2GOEmail } from '../../../lib/smtp2go';
import { sanitizeHtml, isValidEmail, validateInputLength } from '../../../lib/sanitize';
import { rateLimit, getClientIP } from '../../../lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - 3 requests per 15 minutes per IP
    const clientIP = getClientIP(req);
    const rateLimitResult = rateLimit(`contact:${clientIP}`, 3, 15 * 60 * 1000);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    const body = await req.json();
    const { name, email, phone, message, cfTurnstileResponse } = body;

    // Validate required fields
    if (!name || !email || !message || !cfTurnstileResponse) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate input lengths
    if (!validateInputLength(name, 100) || !validateInputLength(email, 100) || 
        !validateInputLength(message, 2000) || (phone && !validateInputLength(phone, 20))) {
      return NextResponse.json(
        { error: 'Input too long' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeHtml(name);
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedPhone = phone ? sanitizeHtml(phone) : '';
    const sanitizedMessage = sanitizeHtml(message);

    // Verify Cloudflare Turnstile token (skip if no secret key in development)
    if (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY) {
      const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
          response: cfTurnstileResponse,
          remoteip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown',
        }),
      });

      const turnstileResult = await turnstileResponse.json();

      if (!turnstileResult.success) {
        console.error('Turnstile verification failed:', turnstileResult);
        return NextResponse.json(
          { error: 'Spam protection verification failed' },
          { status: 400 }
        );
      }
    } else {
      console.log('Skipping Turnstile verification - no secret key configured');
    }

    // Check SMTP2GO API key
    if (!process.env.SMTP2GO_API_KEY) {
      console.error('SMTP2GO_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }
    
    console.log('Attempting to send email with SMTP2GO...');

    // Create HTML content for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #3b7d98; padding-bottom: 10px;">
          New Contact Form Submission - Topos Collective
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          ${sanitizedPhone ? `<p><strong>Phone:</strong> ${sanitizedPhone}</p>` : ''}
        </div>

        <div style="background-color: #fff; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${sanitizedMessage}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px;">
          <p>This message was sent from the Topos Collective contact form.</p>
          <p>Submitted on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    // Send email using SMTP2GO
    // Using same sender email and API key as katie-site
    const fromEmail = process.env.SMTP2GO_FROM_EMAIL || 'noreply@katieshowellrealtor.com';
    const toEmail = process.env.CONTACT_EMAIL || 'katieshowellatx@gmail.com';
    
    // Log email configuration for debugging
    console.log('Email configuration:', {
      from: fromEmail,
      to: toEmail,
    });
    
    try {
      const emailResponse = await sendSMTP2GOEmail({
        html: htmlContent,
        subject: `New Contact Form Submission from ${sanitizedName}`,
        from_email: fromEmail,
        from_name: 'Topos Collective',
        to: [
          {
            email: toEmail,
          },
        ],
        reply_to: sanitizedEmail,
        custom_headers: {
          'X-Form-Type': 'contact',
          'X-Submitter-Name': sanitizedName,
          'X-Submitter-Email': sanitizedEmail,
        },
      });
      
      console.log('Contact form submission sent successfully:', { name: sanitizedName, email: sanitizedEmail, phone: sanitizedPhone });
      console.log('Email response:', emailResponse);
    } catch (error: any) {
      console.error('SMTP2GO email error:', error);
      
      let errorMessage = 'Failed to send email';
      let errorDetails = 'Unknown error';
      
      if (error instanceof Error) {
        errorDetails = error.message;
        errorMessage = error.message;
        
        // Check for common SMTP2GO issues
        if (error.message.includes('API key') || error.message.includes('api_key')) {
          errorMessage = 'SMTP2GO API key invalid or missing';
        } else if (error.message.includes('sender') || error.message.includes('from')) {
          errorMessage = 'Sender email not verified in SMTP2GO';
        }
      }
      
      return NextResponse.json(
        { error: errorMessage, details: errorDetails },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

