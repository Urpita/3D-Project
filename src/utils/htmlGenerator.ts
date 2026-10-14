import { CampaignEmail } from '../types/campaign';

export function generateResponsiveEmailHtml(email: CampaignEmail, campaignTitle: string = 'CampaignForge'): string {
  const activeSubject = email.subjectLines[email.selectedSubjectIndex]?.text || email.subjectLines[0]?.text || '';
  const heroImg = email.heroImageUrl || 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=80';

  const benefitsHtml = (email.bodyContent.keyBenefits || [])
    .map(
      (b) => `
      <tr>
        <td style="padding: 12px 0;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td valign="top" style="width: 38px; font-size: 24px; line-height: 1; padding-top: 2px;">
                ${b.icon || '✨'}
              </td>
              <td valign="top" style="padding-left: 10px;">
                <strong style="color: #0f172a; font-size: 15px; font-weight: 700; display: block; margin-bottom: 3px;">${escapeHtml(b.title)}</strong>
                <span style="color: #475569; font-size: 14px; line-height: 1.5;">${escapeHtml(b.description)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(activeSubject)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-button { width: 100% !important; display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="background-color: #f1f5f9; margin: 0; padding: 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Hidden Preheader Preview Text -->
  <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${escapeHtml(email.preheader || '')}
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 12px;">
        <!-- Email Container (600px Max) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
          
          <!-- Brand / Sequence Top Header -->
          <tr>
            <td style="padding: 20px 32px 16px 32px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;" class="fluid-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" style="font-size: 13px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.8px;">
                    ${escapeHtml(campaignTitle)}
                  </td>
                  <td align="right" style="font-size: 12px; color: #94a3b8; font-weight: 500;">
                    ${escapeHtml(email.delayInfo || '')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Image Banner -->
          <tr>
            <td style="padding: 0; background-color: #0f172a;">
              <img src="${heroImg}" alt="${escapeHtml(email.heroTitle)}" width="600" style="width: 100%; max-width: 600px; height: auto; display: block; object-fit: cover; max-height: 320px;" />
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 32px 24px 32px;" class="fluid-padding">
              
              <!-- Hero Headline -->
              <h1 style="margin: 0 0 12px 0; font-size: 26px; line-height: 1.3; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
                ${escapeHtml(email.heroTitle)}
              </h1>
              
              <!-- Subtitle Hook -->
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #475569; font-weight: 400;">
                ${escapeHtml(email.heroSubtitle)}
              </p>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0 24px 0;" />

              <!-- Greeting & Intro Paragraph -->
              <p style="margin: 0 0 14px 0; font-size: 15px; font-weight: 600; color: #0f172a;">
                ${escapeHtml(email.bodyContent.greeting || 'Hey there,')}
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #334155;">
                ${escapeHtml(email.bodyContent.intro || '')}
              </p>

              <!-- Key Benefits List -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0 28px 0; background-color: #f8fafc; border-radius: 8px; padding: 16px 20px; border: 1px solid #edf2f7;">
                ${benefitsHtml}
              </table>

              <!-- Special Offer Callout Box -->
              ${
                email.bodyContent.offerBox
                  ? `
              <div style="background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%); border-radius: 10px; padding: 24px; margin: 28px 0; border: 1px solid #c7d2fe; text-align: center;">
                <span style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;">
                  ${escapeHtml(email.bodyContent.offerBox.badge || 'SPECIAL OFFER')}
                </span>
                <h3 style="margin: 0 0 8px 0; font-size: 19px; color: #1e1b4b; font-weight: 800;">
                  ${escapeHtml(email.bodyContent.offerBox.headline || '')}
                </h3>
                <p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.5; color: #4338ca;">
                  ${escapeHtml(email.bodyContent.offerBox.details || '')}
                </p>
                ${
                  email.bodyContent.offerBox.couponCode
                    ? `
                <div style="display: inline-block; border: 2px dashed #6366f1; background-color: #ffffff; padding: 8px 18px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: 700; color: #4338ca; letter-spacing: 1px;">
                  ${escapeHtml(email.bodyContent.offerBox.couponCode)}
                </div>
                `
                    : ''
                }
              </div>
              `
                  : ''
              }

              <!-- Social Proof / Testimonial -->
              ${
                email.bodyContent.socialProof
                  ? `
              <div style="border-left: 3px solid #6366f1; padding: 8px 0 8px 16px; margin: 24px 0 28px 0;">
                <p style="margin: 0 0 6px 0; font-size: 14px; font-style: italic; line-height: 1.6; color: #475569;">
                  ${escapeHtml(email.bodyContent.socialProof.quote || '')}
                </p>
                <p style="margin: 0; font-size: 12px; font-weight: 700; color: #0f172a;">
                  — ${escapeHtml(email.bodyContent.socialProof.author || '')}
                  ${email.bodyContent.socialProof.metric ? `<span style="font-weight: normal; color: #64748b; margin-left: 6px;">(${escapeHtml(email.bodyContent.socialProof.metric)})</span>` : ''}
                </p>
              </div>
              `
                  : ''
              }

              <!-- Main Call To Action Button -->
              <div style="text-align: center; margin: 36px 0 24px 0;">
                <a href="${escapeHtml(email.bodyContent.callToAction?.url || '#')}" class="mobile-button" style="background-color: #4f46e5; color: #ffffff; display: inline-block; padding: 16px 36px; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35); text-align: center; letter-spacing: -0.2px;">
                  ${escapeHtml(email.bodyContent.callToAction?.text || 'Claim Your Offer →')}
                </a>
                ${
                  email.bodyContent.callToAction?.subtext
                    ? `
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">
                  ${escapeHtml(email.bodyContent.callToAction.subtext)}
                </p>
                `
                    : ''
                }
              </div>

              <!-- Secondary Offer / Link -->
              ${
                email.bodyContent.secondaryOffer
                  ? `
              <p style="text-align: center; margin: 16px 0 24px 0; font-size: 13px; color: #64748b;">
                ${escapeHtml(email.bodyContent.secondaryOffer)}
              </p>
              `
                  : ''
              }

              <!-- P.S. High-Conversion Section -->
              ${
                email.bodyContent.psLine
                  ? `
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 14px 18px; margin: 24px 0;">
                <p style="margin: 0; font-size: 13px; line-height: 1.55; color: #92400e;">
                  <strong>P.S.</strong> ${escapeHtml(email.bodyContent.psLine.replace(/^P\.S\.\s*/i, ''))}
                </p>
              </div>
              `
                  : ''
              }

              <!-- Sender Signoff -->
              <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #334155; white-space: pre-line;">
                  ${escapeHtml(email.bodyContent.signoff || 'Warmly,\nThe Team')}
                </p>
              </div>

            </td>
          </tr>

          <!-- Compliance & Unsubscribe Footer -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; line-height: 1.6; color: #94a3b8;" class="fluid-padding">
              <p style="margin: 0 0 8px 0;">
                You received this email because you are a registered subscriber of <strong>${escapeHtml(campaignTitle)}</strong>.
              </p>
              <p style="margin: 0 0 12px 0;">
                100 Innovation Way, Suite 400 • New York, NY 10001
              </p>
              <p style="margin: 0;">
                <a href="#" style="color: #64748b; text-decoration: underline; margin: 0 6px;">Manage Preferences</a> • 
                <a href="#" style="color: #64748b; text-decoration: underline; margin: 0 6px;">Unsubscribe</a> • 
                <a href="#" style="color: #64748b; text-decoration: underline; margin: 0 6px;">View in Browser</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
