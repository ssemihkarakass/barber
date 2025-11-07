# 📱 BİLDİRİM SİSTEMİ PLANI

## 🎯 HEDEF
Randevu alındığında çalışana bildirim gitmesi

---

## 📋 SEÇENEKLER

### SEÇENEK 1: WEB PUSH NOTIFICATIONS (ÜCRETSİZ)
**Avantajlar:**
- ✅ Tamamen ücretsiz
- ✅ Tarayıcıda çalışır
- ✅ iOS Safari ve Android Chrome destekler
- ✅ Kolay kurulum

**Dezavantajlar:**
- ❌ Kullanıcı izin vermeli
- ❌ Tarayıcı kapalıysa bildirim gelmez
- ❌ iOS'ta sınırlı destek

**Kurulum:**
```bash
npm install web-push
```

**Nasıl Çalışır:**
1. Çalışan ilk girişte bildirim izni ister
2. Subscription kaydedilir
3. Randevu alınınca push notification gönderilir

---

### SEÇENEK 2: SMS (ÜCRETLI)
**Avantajlar:**
- ✅ %100 ulaşım garantisi
- ✅ Uygulama açık olmasına gerek yok
- ✅ iOS ve Android'de çalışır

**Dezavantajlar:**
- ❌ Ücretli (SMS başına ~0.10₺)
- ❌ API key gerekli

**Servisler:**
- **Twilio** - En popüler
- **Netgsm** - Türkiye'de yaygın
- **İletimerkezi** - Türk alternatif

**Maliyet:**
- 100 SMS = ~10₺
- 1000 SMS = ~100₺

---

### SEÇENEK 3: WHATSAPP BUSINESS API (ÜCRETLI)
**Avantajlar:**
- ✅ Herkes WhatsApp kullanıyor
- ✅ Zengin mesaj formatı
- ✅ Ücretsiz template mesajlar

**Dezavantajlar:**
- ❌ WhatsApp Business hesabı gerekli
- ❌ Onay süreci var
- ❌ Kurulum karmaşık

**Servisler:**
- **Twilio WhatsApp API**
- **MessageBird**
- **360dialog**

---

### SEÇENEK 4: EMAIL (ÜCRETSİZ/ÜCRETLI)
**Avantajlar:**
- ✅ Ücretsiz seçenekler var
- ✅ Kolay kurulum
- ✅ Detaylı bilgi gönderilebilir

**Dezavantajlar:**
- ❌ Spam klasörüne düşebilir
- ❌ Hemen görülmeyebilir

**Servisler:**
- **Resend** - Ücretsiz 3000/ay
- **SendGrid** - Ücretsiz 100/gün
- **Mailgun** - Ücretsiz 5000/ay

---

### SEÇENEK 5: PROGRESSIVE WEB APP (PWA) + PUSH
**Avantajlar:**
- ✅ Ana ekrana eklenebilir
- ✅ Uygulama gibi çalışır
- ✅ iOS ve Android destekler
- ✅ Ücretsiz

**Dezavantajlar:**
- ❌ Kullanıcı yüklemeli
- ❌ iOS'ta sınırlı

**Kurulum:**
```bash
# Next.js PWA
npm install next-pwa
```

---

## 🏆 TAVSİYE EDİLEN ÇÖZÜM

### AŞAMA 1: EMAIL (HEMEN BAŞLA)
```typescript
// Resend ile ücretsiz email
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'randevu@furkanemer.com',
  to: employee.email,
  subject: 'Yeni Randevu!',
  html: `
    <h1>Yeni Randevu Aldınız!</h1>
    <p>Müşteri: ${customer.name}</p>
    <p>Tarih: ${date}</p>
    <p>Saat: ${time}</p>
    <p>Hizmet: ${service.name}</p>
  `
})
```

### AŞAMA 2: WEB PUSH (SONRA EKLE)
```typescript
// Service Worker ile push notification
// Tarayıcıda bildirim göster
```

### AŞAMA 3: SMS (İSTERSEN)
```typescript
// Twilio ile SMS
import twilio from 'twilio'

const client = twilio(accountSid, authToken)

await client.messages.create({
  body: 'Yeni randevu aldınız!',
  from: '+1234567890',
  to: employee.phone
})
```

---

## 💰 MALİYET KARŞILAŞTIRMASI

| Yöntem | Aylık Maliyet | Kurulum | Ulaşım |
|--------|---------------|---------|--------|
| Email | ₺0 | Kolay | %70 |
| Web Push | ₺0 | Orta | %50 |
| SMS | ~₺100 | Kolay | %100 |
| WhatsApp | ~₺50 | Zor | %95 |
| PWA | ₺0 | Orta | %60 |

---

## 🚀 HEMEN BAŞLA: EMAIL KURULUMU

### 1. Resend Hesabı Aç
https://resend.com/signup

### 2. API Key Al
Dashboard → API Keys → Create

### 3. .env.local'e Ekle
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### 4. Kodu Ekle
```typescript
// app/api/send-notification/route.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { employeeEmail, customerName, date, time, service } = await req.json()
  
  await resend.emails.send({
    from: 'randevu@furkanemer.com',
    to: employeeEmail,
    subject: '🔔 Yeni Randevu!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #C4A747;">Yeni Randevu Aldınız!</h1>
        <p><strong>Müşteri:</strong> ${customerName}</p>
        <p><strong>Tarih:</strong> ${date}</p>
        <p><strong>Saat:</strong> ${time}</p>
        <p><strong>Hizmet:</strong> ${service}</p>
      </div>
    `
  })
  
  return Response.json({ success: true })
}
```

### 5. Randevu Alımında Çağır
```typescript
// app/book/page.tsx
const handleBooking = async () => {
  // ... randevu kaydet
  
  // Email gönder
  await fetch('/api/send-notification', {
    method: 'POST',
    body: JSON.stringify({
      employeeEmail: employee.email,
      customerName: user.name,
      date: selectedDate,
      time: selectedTime,
      service: selectedService.name
    })
  })
}
```

---

## 📱 ALTERNATİF: SUBDOMAIN

### calisan.furkanemer.com

**Avantajlar:**
- ✅ Ayrı bir panel
- ✅ Mobil uyumlu
- ✅ Ana ekrana eklenebilir

**Kurulum:**
1. Vercel'de domain ayarla
2. `calisan.furkanemer.com` → `/employee` yönlendir
3. PWA manifest ekle

**Manifest:**
```json
{
  "name": "Furkan Emer Berber - Çalışan",
  "short_name": "Çalışan Panel",
  "start_url": "/employee",
  "display": "standalone",
  "theme_color": "#C4A747",
  "icons": [...]
}
```

---

## ✅ SONUÇ

**EN İYİ ÇÖZÜM:**
1. **Şimdi:** Email bildirimleri (Resend - Ücretsiz)
2. **Sonra:** PWA + Web Push
3. **İsteğe bağlı:** SMS (önemli randevular için)

**Tavsiyem:** Email ile başla, çalışırsa SMS ekle!
