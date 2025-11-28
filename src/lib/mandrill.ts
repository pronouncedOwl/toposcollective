/**
 * Mandrill (Mailchimp Transactional) email utility
 * Documentation: https://mailchimp.com/developer/transactional/api/messages/
 */

export interface MandrillMessage {
  html: string;
  subject: string;
  from_email: string;
  from_name?: string;
  to: Array<{
    email: string;
    name?: string;
    type?: 'to' | 'cc' | 'bcc';
  }>;
  tags?: string[];
  metadata?: Record<string, string>;
}

export interface MandrillResponse {
  _id: string;
  email: string;
  status: 'sent' | 'queued' | 'rejected' | 'invalid' | 'scheduled';
  reject_reason?: string;
}

/**
 * Send an email using Mandrill API
 */
export async function sendMandrillEmail(message: MandrillMessage): Promise<MandrillResponse[]> {
  const apiKey = process.env.MANDRILL_API_KEY;
  
  if (!apiKey) {
    throw new Error('MANDRILL_API_KEY is not configured');
  }

  const payload = {
    key: apiKey,
    message: {
      html: message.html,
      subject: message.subject,
      from_email: message.from_email,
      from_name: message.from_name,
      to: message.to,
      tags: message.tags || [],
      metadata: message.metadata || {},
    },
  };

  const response = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    console.error('Mandrill API error:', errorData);
    
    // Extract error message
    let errorMessage = 'Failed to send email';
    if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.name) {
      errorMessage = errorData.name;
    }
    
    throw new Error(errorMessage);
  }

  const result = await response.json();
  
  // Check if any messages were rejected
  const rejected = result.filter((r: MandrillResponse) => r.status === 'rejected' || r.status === 'invalid');
  if (rejected.length > 0) {
    const reasons = rejected.map((r: MandrillResponse) => r.reject_reason || 'Unknown reason').join('; ');
    throw new Error(`Email rejected: ${reasons}`);
  }

  return result;
}

