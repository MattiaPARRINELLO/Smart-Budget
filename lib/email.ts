import nodemailer from 'nodemailer'
import { siteConfig } from './config'

// Créer le transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Template email de confirmation
function getConfirmationEmailTemplate(token: string): string {
  const confirmUrl = `${siteConfig.url}/api/newsletter/confirm?token=${token}`
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmez votre inscription</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 30px; background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); border-radius: 24px 24px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                ${siteConfig.name} 💰
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px; background-color: white;">
              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 24px;">
                Bienvenue parmi nous ! 🎉
              </h2>
              
              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Merci de vous être inscrit à la newsletter ${siteConfig.name}. 
                Vous recevrez chaque semaine nos meilleurs conseils pour gérer votre budget intelligemment.
              </p>
              
              <p style="margin: 0 0 30px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Pour finaliser votre inscription, cliquez sur le bouton ci-dessous :
              </p>
              
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="background-color: #0ea5e9; border-radius: 12px;">
                    <a href="${confirmUrl}" 
                       style="display: inline-block; padding: 16px 32px; color: white; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Confirmer mon inscription ✓
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                <a href="${confirmUrl}" style="color: #0ea5e9; word-break: break-all;">${confirmUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f4f4f5; border-radius: 0 0 24px 24px;">
              <p style="margin: 0; color: #71717a; font-size: 14px; text-align: center;">
                Vous recevez cet email car vous vous êtes inscrit sur ${siteConfig.name}.<br>
                Si ce n'est pas vous, ignorez simplement ce message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// Envoyer l'email de confirmation
export async function sendConfirmationEmail(email: string, token: string): Promise<void> {
  // En développement, juste log
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
    console.log('📧 Email de confirmation (dev mode):')
    console.log(`   To: ${email}`)
    console.log(`   Token: ${token}`)
    console.log(`   URL: ${siteConfig.url}/api/newsletter/confirm?token=${token}`)
    return
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `${siteConfig.name} <noreply@smartbudget.fr>`,
    to: email,
    subject: `Confirmez votre inscription à ${siteConfig.name} 💌`,
    html: getConfirmationEmailTemplate(token),
  })
}

// Template newsletter
export function getNewsletterTemplate(subject: string, content: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px 40px; background-color: white; border-radius: 24px 24px 0 0; border-bottom: 1px solid #e4e4e7;">
              <a href="${siteConfig.url}" style="text-decoration: none;">
                <span style="font-size: 24px; font-weight: bold; color: #18181b;">
                  ${siteConfig.name} 💰
                </span>
              </a>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px; background-color: white;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f4f4f5; border-radius: 0 0 24px 24px; text-align: center;">
              <p style="margin: 0 0 10px; color: #71717a; font-size: 14px;">
                Vous recevez cet email car vous êtes inscrit à la newsletter ${siteConfig.name}.
              </p>
              <p style="margin: 0;">
                <a href="${siteConfig.url}/newsletter/desinscription" style="color: #71717a; font-size: 14px;">
                  Se désinscrire
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
