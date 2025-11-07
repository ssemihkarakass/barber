# 🚀 VERCEL DEPLOYMENT REHBERİ

## ✅ GIT PUSH TAMAMLANDI!

Tüm değişiklikler GitHub'a push edildi. Şimdi Vercel'de deploy edebilirsin!

---

## 📋 VERCEL DEPLOYMENT ADIMLARI

### 1. Vercel'e Git
```
https://vercel.com
```

### 2. New Project
- "Add New" → "Project" tıkla
- GitHub repository'ni seç
- "berber" projesini seç

### 3. Environment Variables Ekle

**Settings → Environment Variables:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://veoogoljdzwisidhlnnp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Resend (Email - Opsiyonel)
RESEND_API_KEY=your_resend_key_here

# App URL (Deploy sonrası güncelle)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**Supabase bilgilerini nereden bulacaksın:**
1. Supabase Dashboard → Project Settings
2. API → Project URL (NEXT_PUBLIC_SUPABASE_URL)
3. API → anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 4. Deploy!
- "Deploy" butonuna bas
- Bekle (2-3 dakika)
- Deploy tamamlandı! 🎉

---

## 🗄️ SUPABASE SQL ÇALIŞTIR

### Deploy Sonrası Mutlaka Yap:

**1. Status Constraint Düzeltmesi:**
```sql
-- Supabase Dashboard → SQL Editor → New Query

ALTER TABLE public.appointments 
DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE public.appointments 
ADD CONSTRAINT appointments_status_check 
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));
```

**2. Hizmetleri Güncelle:**
```sql
-- supabase/update_services.sql dosyasını kopyala
-- SQL Editor'a yapıştır
-- Run
```

---

## ✅ DEPLOYMENT SONRASI TEST

### 1. Ana Sayfa:
```
https://your-project.vercel.app
```

### 2. Test Edilecekler:
- [ ] Ana sayfa yükleniyor
- [ ] Login çalışıyor
- [ ] Register çalışıyor
- [ ] Dashboard açılıyor
- [ ] Randevu alınabiliyor
- [ ] Admin panel çalışıyor
- [ ] Employee panel çalışıyor
- [ ] Takvim görünüyor
- [ ] Mobil responsive

### 3. Mobil Test:
- [ ] Telefonda aç
- [ ] Tüm sayfalar düzgün
- [ ] Scroll çalışıyor
- [ ] Butonlar tıklanıyor

---

## 🎨 İKONLARI EKLE

### Sonra Yapılacak:

1. **İkonları Oluştur:**
   - Rehber: `ICON_OLUSTUR.md`
   - Canva veya Figma kullan
   - 192x192 ve 512x512 boyutlarında

2. **Yükle:**
   - `public/icon-192.png` değiştir
   - `public/icon-512.png` değiştir

3. **Push:**
   ```bash
   git add public/icon-*.png
   git commit -m "feat: Add real PWA icons"
   git push
   ```

4. **Vercel Otomatik Deploy Eder**

---

## 🔧 SORUN GİDERME

### Build Hatası Alırsan:

**1. Vercel Logs Kontrol Et:**
- Deployment → View Function Logs
- Hatayı oku

**2. Sık Karşılaşılan Hatalar:**

**TypeScript Hatası:**
```bash
# Local'de test et
npm run build
```

**Environment Variables Eksik:**
- Vercel → Settings → Environment Variables
- Tüm değişkenleri kontrol et
- Redeploy

**Supabase Bağlantı Hatası:**
- URL ve Key'leri kontrol et
- Supabase RLS policies kontrol et

---

## 📊 PERFORMANS OPTİMİZASYONU

### Vercel Settings:

**1. Caching:**
- Otomatik aktif ✅

**2. Edge Functions:**
- Middleware otomatik edge'de çalışır ✅

**3. Image Optimization:**
- Next.js otomatik optimize eder ✅

---

## 🔒 GÜVENLİK

### Kontrol Et:

**1. Environment Variables:**
- [ ] API keys güvenli
- [ ] Production'da doğru değerler
- [ ] .env.local gitignore'da

**2. Supabase RLS:**
- [ ] Users tablosu RLS aktif
- [ ] Appointments tablosu RLS aktif
- [ ] Services tablosu RLS aktif
- [ ] Employees tablosu RLS aktif

**3. CORS:**
- Supabase → Settings → API
- Allowed Origins → Vercel URL'ini ekle

---

## 🎯 CUSTOM DOMAIN (Opsiyonel)

### Kendi Domain'ini Bağla:

**1. Vercel'de:**
- Settings → Domains
- Add Domain
- Domain'ini gir (örn: furkanemer.com)

**2. DNS Ayarları:**
- Domain sağlayıcında (GoDaddy, Namecheap, vb.)
- A Record ekle
- Vercel IP'sini gir

**3. SSL:**
- Vercel otomatik SSL sertifikası verir
- 24 saat içinde aktif olur

---

## 📱 PWA TEST

### PWA Çalışıyor mu?

**1. Chrome DevTools:**
- F12 → Application
- Manifest → Kontrol et
- Service Workers → Kontrol et

**2. Lighthouse:**
- F12 → Lighthouse
- PWA kategorisini test et
- 90+ skor olmalı

**3. Mobilde:**
- Chrome'da aç
- "Ana ekrana ekle" çıkmalı
- Ekle ve test et

---

## ✅ DEPLOYMENT TAMAMLANDI!

### Başarılı Deploy Sonrası:

```
✅ Site yayında: https://your-project.vercel.app
✅ Supabase SQL çalıştırıldı
✅ Environment variables ayarlandı
✅ Mobil responsive
✅ PWA çalışıyor
```

### Sonraki Adımlar:

1. **İkonları Ekle** (ICON_OLUSTUR.md)
2. **Test Et** (Tüm özellikler)
3. **Custom Domain** (Opsiyonel)
4. **Analytics Ekle** (Vercel Analytics)

---

## 🎉 TEBRIKLER!

**Furkan Emer Berber sitesi artık yayında!** 🚀

### Özellikler:
✅ Mobil uyumlu
✅ PWA desteği
✅ Web push notifications
✅ Randevu sistemi
✅ Admin paneli
✅ Employee paneli
✅ Takvim sistemi
✅ Fiyat listesi

**BAŞARILAR!** 🎉
