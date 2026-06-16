const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'FERI <onboarding@resend.dev>'

const wrap = (content) => `<!DOCTYPE html><html><body style="margin:0;padding:20px;background:#F8F6F1;font-family:Arial,sans-serif;"><table width="100%" style="max-width:600px;margin:0 auto;"><tr><td style="background:#1A1A1A;padding:20px;text-align:center;border-radius:12px 12px 0 0;"><span style="color:#F8F6F1;font-size:20px;letter-spacing:0.2em;">FERI</span></td></tr><tr><td style="background:#fff;padding:32px;border:1px solid #E5E0D8;">${content}</td></tr><tr><td style="background:#F8F6F1;padding:16px;text-align:center;border:1px solid #E5E0D8;border-top:none;border-radius:0 0 12px 12px;"><p style="margin:0;font-size:12px;color:#6B6B6B;">Nepal's trusted second-hand marketplace</p></td></tr></table></body></html>`

const sendWelcomeEmail = async ({ email, name, role }) => {
  try {
    await resend.emails.send({ from: FROM, to: email, subject: `Welcome to FERI, ${name}!`,
      html: wrap(`<h1 style="font-size:24px;color:#1A1A1A;">Welcome, ${name}!</h1><p style="color:#6B6B6B;">${role === 'SELLER' ? 'Complete your Commitment Pledge to start listing.' : "Start exploring Nepal's most trusted second-hand marketplace."}</p><a href="https://feri-neon.vercel.app" style="display:inline-block;background:#1A1A1A;color:#F8F6F1;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Go to FERI</a>`)
    })
  } catch(e) { console.log('Email error:', e.message) }
}

const sendOrderPlacedBuyer = async ({ buyerEmail, buyerName, orderId, trackingCode, items, total }) => {
  try {
    const itemRows = items.map(i => `<tr><td style="padding:8px 0;border-bottom:1px solid #E5E0D8;font-size:14px;">${i.title}</td><td style="padding:8px 0;border-bottom:1px solid #E5E0D8;text-align:right;font-size:14px;">NPR ${i.price.toLocaleString()}</td></tr>`).join('')
    await resend.emails.send({ from: FROM, to: buyerEmail, subject: `Order Confirmed — ${trackingCode} | FERI`,
      html: wrap(`<h1 style="font-size:24px;color:#1A1A1A;">Order Confirmed!</h1><p style="color:#6B6B6B;">Hi ${buyerName}, your order <strong>${trackingCode}</strong> has been placed.</p><table width="100%" style="border-collapse:collapse;margin:16px 0;">${itemRows}</table><p style="font-weight:600;">Total: NPR ${total.toLocaleString()}</p><a href="https://feri-neon.vercel.app/orders/${orderId}" style="display:inline-block;background:#1A1A1A;color:#F8F6F1;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Track Order</a>`)
    })
  } catch(e) { console.log('Email error:', e.message) }
}

const sendOrderPlacedSeller = async ({ sellerEmail, sellerName, buyerName, orderId, trackingCode, items, total }) => {
  try {
    const itemList = items.map(i => `<li style="margin-bottom:6px;">${i.title} — NPR ${i.price.toLocaleString()}</li>`).join('')
    await resend.emails.send({ from: FROM, to: sellerEmail, subject: `New Order — ${trackingCode} | FERI`,
      html: wrap(`<h1 style="font-size:24px;color:#1A1A1A;">New Order!</h1><p style="color:#6B6B6B;">Hi ${sellerName}, ${buyerName} just ordered from your shop.</p><ul style="margin:16px 0;padding-left:20px;">${itemList}</ul><p style="font-weight:600;">Total: NPR ${total.toLocaleString()}</p><p style="color:#B8860B;background:#FFF8E7;padding:12px;border-radius:8px;">Please prepare and ship within your committed timeframe.</p><a href="https://feri-neon.vercel.app/seller/dashboard" style="display:inline-block;background:#1A1A1A;color:#F8F6F1;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">View Dashboard</a>`)
    })
  } catch(e) { console.log('Email error:', e.message) }
}

const sendOrderShipped = async ({ buyerEmail, buyerName, orderId, trackingCode }) => {
  try {
    await resend.emails.send({ from: FROM, to: buyerEmail, subject: `Your order is on its way! — ${trackingCode} | FERI`,
      html: wrap(`<h1 style="font-size:24px;color:#1A1A1A;">Your order is shipped!</h1><p style="color:#6B6B6B;">Hi ${buyerName}, your order <strong>${trackingCode}</strong> is on its way.</p><a href="https://feri-neon.vercel.app/orders/${orderId}" style="display:inline-block;background:#1A1A1A;color:#F8F6F1;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Track Order</a>`)
    })
  } catch(e) { console.log('Email error:', e.message) }
}

const sendNewReview = async ({ sellerEmail, sellerName, buyerName, productTitle, rating, reviewBody }) => {
  try {
    const stars = '★'.repeat(rating) + '☆'.repeat(5-rating)
    await resend.emails.send({ from: FROM, to: sellerEmail, subject: `New review on "${productTitle}" | FERI`,
      html: wrap(`<h1 style="font-size:24px;color:#1A1A1A;">New Review!</h1><p style="color:#6B6B6B;">Hi ${sellerName}, ${buyerName} left a review.</p><div style="background:#F8F6F1;padding:16px;border-radius:8px;margin:16px 0;"><p style="color:#B8860B;font-size:20px;margin:0 0 8px;">${stars}</p><p style="font-style:italic;color:#1A1A1A;">"${reviewBody}"</p><p style="color:#6B6B6B;font-size:12px;">on ${productTitle}</p></div><a href="https://feri-neon.vercel.app/seller/dashboard" style="display:inline-block;background:#1A1A1A;color:#F8F6F1;padding:12px 24px;border-radius:8px;text-decoration:none;">View Dashboard</a>`)
    })
  } catch(e) { console.log('Email error:', e.message) }
}

module.exports = { sendWelcomeEmail, sendOrderPlacedBuyer, sendOrderPlacedSeller, sendOrderShipped, sendNewReview }
