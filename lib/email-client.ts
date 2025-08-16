// Email notification client
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  variables: string[]
}

export interface EmailNotification {
  to: string
  subject: string
  html: string
  template_id?: string
  variables?: Record<string, string>
}

// Email templates
export const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to StreamPlay!',
    html: `
      <h1>Welcome {{name}}!</h1>
      <p>Thank you for joining StreamPlay. Your subscription is now active.</p>
      <p>Plan: {{plan_name}}</p>
      <p>Next billing date: {{next_billing_date}}</p>
    `,
    variables: ['name', 'plan_name', 'next_billing_date']
  },
  {
    id: 'payment_success',
    name: 'Payment Success',
    subject: 'Payment Received - StreamPlay',
    html: `
      <h1>Payment Received</h1>
      <p>Hi {{name}},</p>
      <p>We've successfully processed your payment of {{amount}} {{currency}}.</p>
      <p>Transaction ID: {{transaction_id}}</p>
      <p>Thank you for your continued subscription!</p>
    `,
    variables: ['name', 'amount', 'currency', 'transaction_id']
  },
  {
    id: 'payment_failed',
    name: 'Payment Failed',
    subject: 'Payment Failed - Action Required',
    html: `
      <h1>Payment Failed</h1>
      <p>Hi {{name}},</p>
      <p>We were unable to process your payment of {{amount}} {{currency}}.</p>
      <p>Please update your payment method to continue your subscription.</p>
      <p>Reason: {{failure_reason}}</p>
    `,
    variables: ['name', 'amount', 'currency', 'failure_reason']
  }
]

// Missing export alias
export const emailService = new EmailClient()

export class EmailClient {
  static async sendEmail(notification: EmailNotification): Promise<boolean> {
    try {
      // Mock implementation - in production, integrate with service like SendGrid, AWS SES, etc.
      console.log('Sending email:', notification)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  static async sendTemplateEmail(
    to: string,
    template_id: string,
    variables: Record<string, string>
  ): Promise<boolean> {
    const template = emailTemplates.find(t => t.id === template_id)
    if (!template) {
      console.error(`Template not found: ${template_id}`)
      return false
    }

    let html = template.html
    let subject = template.subject

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      html = html.replace(new RegExp(placeholder, 'g'), value)
      subject = subject.replace(new RegExp(placeholder, 'g'), value)
    }

    return this.sendEmail({
      to,
      subject,
      html,
      template_id,
      variables
    })
  }

  static getTemplate(id: string): EmailTemplate | undefined {
    return emailTemplates.find(template => template.id === id)
  }

  static getAllTemplates(): EmailTemplate[] {
    return emailTemplates
  }
}