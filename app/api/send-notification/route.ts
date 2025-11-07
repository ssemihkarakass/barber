import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { type, employeeEmail, employeeName, customerName, customerEmail, date, time, service, appointmentId } = await req.json()

    let subject = ''
    let html = ''

    if (type === 'new_appointment') {
      // Çalışana yeni randevu bildirimi
      subject = '🔔 Yeni Randevu Aldınız!'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #C4A747 0%, #D4B857 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #000; margin: 0; font-size: 28px;">Furkan Emer Berber</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #C4A747; margin-top: 0;">Yeni Randevu!</h2>
            
            <p style="color: #333; font-size: 16px;">Merhaba ${employeeName},</p>
            <p style="color: #666;">Yeni bir randevu aldınız. Detaylar aşağıdadır:</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">👤 Müşteri:</td>
                  <td style="padding: 10px 0; color: #333;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">✂️ Hizmet:</td>
                  <td style="padding: 10px 0; color: #333;">${service}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">📅 Tarih:</td>
                  <td style="padding: 10px 0; color: #333;">${date}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">🕐 Saat:</td>
                  <td style="padding: 10px 0; color: #333;">${time}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Randevuyu onaylamak veya iptal etmek için çalışan panelinize giriş yapın.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/employee" 
                 style="background-color: #C4A747; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Çalışan Paneline Git
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>Furkan Emer Berber - Profesyonel Erkek Kuaförü</p>
          </div>
        </div>
      `
    } else if (type === 'appointment_confirmed') {
      // Müşteriye onay bildirimi
      subject = '✅ Randevunuz Onaylandı!'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #C4A747 0%, #D4B857 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #000; margin: 0; font-size: 28px;">Furkan Emer Berber</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #22c55e; margin-top: 0;">Randevunuz Onaylandı! ✅</h2>
            
            <p style="color: #333; font-size: 16px;">Merhaba ${customerName},</p>
            <p style="color: #666;">Randevunuz onaylandı. Sizi bekliyoruz!</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">✂️ Hizmet:</td>
                  <td style="padding: 10px 0; color: #333;">${service}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">👨‍💼 Berber:</td>
                  <td style="padding: 10px 0; color: #333;">${employeeName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">📅 Tarih:</td>
                  <td style="padding: 10px 0; color: #333;">${date}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">🕐 Saat:</td>
                  <td style="padding: 10px 0; color: #333;">${time}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Lütfen randevu saatinizden 5 dakika önce gelin. İyi günler dileriz!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/appointments" 
                 style="background-color: #C4A747; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Randevularımı Görüntüle
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>Furkan Emer Berber - Profesyonel Erkek Kuaförü</p>
            <p>Atatürk Caddesi No:123, İstanbul</p>
            <p>Tel: +90 212 555 0123</p>
          </div>
        </div>
      `
    }

    const { data, error } = await resend.emails.send({
      from: 'Furkan Emer Berber <randevu@furkanemer.com>',
      to: type === 'new_appointment' ? employeeEmail : customerEmail,
      subject,
      html,
    })

    if (error) {
      console.error('Email error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
