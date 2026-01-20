import { Resend } from 'resend'

// Initialize Resend client
// Get API key from: https://resend.com/api-keys
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: 'SchoolGenius <notifications@schoolgenius.app>',
      to,
      subject,
      html
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Failed to send email:', err)
    return { success: false, error: 'Failed to send email' }
  }
}

export { resend }
