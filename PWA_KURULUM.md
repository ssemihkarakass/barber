# 📱 PWA KURULUM REHBERİ

## ✅ TAMAMLANANLAR

### 1. ✅ Manifest Dosyası
- `public/manifest.json` oluşturuldu
- Uygulama adı: "Furkan Emer Berber"
- Tema rengi: #C4A747 (Altın)
- Shortcuts eklendi (Randevu Al, Takvim)

### 2. ✅ Service Worker
- `public/sw.js` oluşturuldu
- Offline cache desteği
- Push notification desteği
- Notification click handler

### 3. ✅ Layout Güncellemeleri
- PWA meta tagları eklendi
- Apple Web App desteği
- Service Worker register component

### 4. ✅ Bildirim Sistemi
- Email bildirimleri (Resend)
- Yeni randevu → Çalışana email
- Randevu onayı → Müşteriye email

### 5. ✅ Session Hatırlama
- "Beni hatırla" checkbox'ı
- Supabase session persistence
- Çıkış yapana kadar oturum açık

### 6. ✅ Firma İsmi
- "BarberPro" → "Furkan Emer Berber"
- Tüm sayfalarda güncellendi

---

## 🚀 NASIL KULLANILIR?

### iOS (Safari):
1. Safari'de siteyi aç
2. Paylaş butonuna bas
3. "Ana Ekrana Ekle" seç
4. İsmi onayla ve ekle

### Android (Chrome):
1. Chrome'da siteyi aç
2. Menü (3 nokta) aç
3. "Ana ekrana ekle" seç
4. İsmi onayla ve ekle

---

## 📱 PWA ÖZELLİKLERİ

### ✅ Çalışıyor:
- Ana ekrana ekleme
- Standalone mod (tam ekran)
- Offline cache
- Tema rengi
- Shortcuts (Randevu Al, Takvim)

### 🔔 Bildirimler:
- Email bildirimleri ✅
- Web Push (manuel kurulum gerekli)

---

## 🔔 WEB PUSH NOTIFICATIONS (OPSİYONEL)

Eğer tarayıcı bildirimleri de istersen:

### 1. Kullanıcıdan İzin İste
```typescript
// components/NotificationPermission.tsx
'use client'

import { useEffect } from 'react'

export function NotificationPermission() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return null
}
```

### 2. Layout'a Ekle
```typescript
import { NotificationPermission } from '@/components/NotificationPermission'

// Layout içinde
<NotificationPermission />
```

### 3. Bildirim Gönder
```typescript
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification('Yeni Randevu!', {
    body: 'Müşteri: Ali Veli\nSaat: 14:00',
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  })
}
```

---

## 📧 EMAIL BİLDİRİMLERİ

### Resend Kurulumu:

1. **Hesap Aç:**
   - https://resend.com/signup
   - Email doğrula

2. **API Key Al:**
   - Dashboard → API Keys
   - "Create API Key"
   - Kopyala

3. **.env.local'e Ekle:**
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Domain Doğrula (Opsiyonel):**
   - Resend Dashboard → Domains
   - "Add Domain"
   - DNS kayıtlarını ekle
   - Doğrulanınca `randevu@furkanemer.com` kullanabilirsin

**Şimdilik test için:** `onboarding@resend.dev` kullanılıyor

---

## 🎨 İKONLAR OLUŞTUR

PWA için ikon gerekli:

### Online Araçlar:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

### Gerekli Boyutlar:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

### Örnek İkon:
Altın renkte (# C4A747) bir makas ikonu veya "FE" harfleri

---

## 🧪 TEST ET

### PWA Testi:
1. Chrome DevTools aç (F12)
2. Application sekmesi
3. Manifest kontrol et
4. Service Worker kontrol et

### Lighthouse Skoru:
1. Chrome DevTools → Lighthouse
2. "Progressive Web App" seç
3. "Generate report"
4. 90+ skor hedefle

---

## 🚀 PRODUCTION DEPLOYMENT

### Vercel'de:
1. `.env.local` değişkenlerini Vercel'e ekle
2. `NEXT_PUBLIC_APP_URL` production URL'e değiştir
3. Deploy et

### Domain Ayarları:
```
furkanemer.com → Ana site
calisan.furkanemer.com → /employee redirect
admin.furkanemer.com → /admin redirect
```

---

## ✅ KONTROL LİSTESİ

- [x] manifest.json oluşturuldu
- [x] Service Worker eklendi
- [x] PWA meta tagları
- [x] Email bildirimleri
- [x] Session hatırlama
- [x] Firma ismi değiştirildi
- [ ] İkonlar oluştur (192x192, 512x512)
- [ ] Resend domain doğrula
- [ ] Production'a deploy et
- [ ] iOS'ta test et
- [ ] Android'de test et

---

## 📱 SONUÇ

**PWA HAZIR!** 🎉

Şimdi yapman gerekenler:
1. İkonları oluştur (`icon-192.png`, `icon-512.png`)
2. `public/` klasörüne koy
3. Resend API key al ve `.env.local`'e ekle
4. Test et (iOS Safari, Android Chrome)
5. Production'a deploy et

**Kullanıcılar artık uygulamayı ana ekrana ekleyebilir!**
