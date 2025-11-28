/**
 * SMTP2GO email utility
 * Documentation: https://www.smtp2go.com/docs/
 * API: https://api.smtp2go.com/v3/email/send
 */

export interface SMTP2GOMessage {
  html: string;
  subject: string;
  from_email: string;
  from_name?: string;
  to: Array<{
    email: string;
    name?: string;
  }>;
  cc?: Array<{
    email: string;
    name?: string;
  }>;
  bcc?: Array<{
    email: string;
    name?: string;
  }>;
  reply_to?: string;
  custom_headers?: Record<string, string>;
}

export interface SMTP2GOResponse {
  data: {
    email_id: string;
    message: string;
  };
  request_id: string;
}

/**
 * Format email address for SMTP2GO API
 * Converts {email, name} to "Name <email@example.com>" format
 */
function formatEmailAddress(email: string, name?: string): string {
  if (name && name.trim()) {
    return `${name} <${email}>`;
  }
  return email;
}

/**
 * Send an email using SMTP2GO API
 */
export async function sendSMTP2GOEmail(message: SMTP2GOMessage): Promise<SMTP2GOResponse> {
  const apiKey = process.env.SMTP2GO_API_KEY;
  
  if (!apiKey) {
    throw new Error('SMTP2GO_API_KEY is not configured');
  }

  // Format sender: "Name <email@example.com>" or just "email@example.com"
  const sender = formatEmailAddress(message.from_email, message.from_name);

  // Format recipients as array of strings: ["Name <email@example.com>", ...]
  const to = message.to.map(recipient => formatEmailAddress(recipient.email, recipient.name));

  const payload: any = {
    sender,
    to,
    subject: message.subject,
    html_body: message.html,
  };

  // Format CC as array of strings
  if (message.cc && message.cc.length > 0) {
    payload.cc = message.cc.map(r => formatEmailAddress(r.email, r.name));
  }

  // Format BCC as array of strings
  if (message.bcc && message.bcc.length > 0) {
    payload.bcc = message.bcc.map(r => formatEmailAddress(r.email, r.name));
  }

  // Build custom headers array (reply_to goes here as Reply-To header)
  const customHeaders: Array<{header: string; value: string}> = [];
  
  if (message.reply_to) {
    customHeaders.push({
      header: 'Reply-To',
      value: message.reply_to,
    });
  }

  if (message.custom_headers) {
    // Add other custom headers
    Object.entries(message.custom_headers).forEach(([header, value]) => {
      customHeaders.push({ header, value });
    });
  }

  if (customHeaders.length > 0) {
    payload.custom_headers = customHeaders;
  }

  const response = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Smtp2go-Api-Key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    console.error('SMTP2GO API error:', errorData);
    
    // Extract error message from SMTP2GO response structure
    let errorMessage = 'Failed to send email';
    if (errorData.data?.error) {
      errorMessage = errorData.data.error;
      // Add field validation errors if present
      if (errorData.data.field_validation_errors) {
        const fieldErrors = errorData.data.field_validation_errors;
        const fieldErrorMsg = Array.isArray(fieldErrors)
          ? fieldErrors.map((e: any) => `${e.fieldname}: ${e.message}`).join('; ')
          : `${fieldErrors.fieldname}: ${fieldErrors.message}`;
        errorMessage += ` (${fieldErrorMsg})`;
      }
    } else if (errorData.error) {
      errorMessage = errorData.error;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    } else if (typeof errorData === 'string') {
      errorMessage = errorData;
    }
    
    throw new Error(errorMessage);
  }

  const result = await response.json();
  
  // Check for errors in response
  if (result.error) {
    throw new Error(result.error);
  }

  return result;
}

/**
 * Get SMTP2GO account information
 * Useful for checking account status and limits
 */
export async function getSMTP2GOAccountInfo(): Promise<any> {
  const apiKey = process.env.SMTP2GO_API_KEY;
  
  if (!apiKey) {
    throw new Error('SMTP2GO_API_KEY is not configured');
  }

  const response = await fetch('https://api.smtp2go.com/v3/stats/view', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Smtp2go-Api-Key': apiKey,
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.error || errorData.message || 'Failed to get account info');
  }

  return await response.json();
}

