# 🚀 SUPABASE KURULUM REHBERİ (Başlangıç Seviyesi)

## ❓ Supabase Nedir?

Supabase, Firebase'e alternatif açık kaynaklı bir backend servisidir. Size şunları sağlar:
- **Veritabanı** (PostgreSQL)
- **Kullanıcı Girişi** (Authentication)
- **Dosya Depolama** (Storage)
- **Gerçek Zamanlı Güncellemeler** (Realtime)

**BarberPro projesi için Supabase'e ihtiyacımız var çünkü:**
- Kullanıcı kayıt/giriş sistemi
- Randevu verilerini saklama
- Hizmet ve çalışan bilgilerini yönetme

---

## 📝 ADIM 1: Supabase Hesabı Oluşturma (5 dakika)

### 1.1 Siteye Gidin
1. Tarayıcınızda [https://supabase.com](https://supabase.com) adresine gidin
2. Sağ üstteki **"Start your project"** butonuna tıklayın

### 1.2 Kayıt Olun
3 seçeneğiniz var:
- **GitHub ile** (önerilen - en hızlı)
- **Google ile**
- **Email ile**

> 💡 **İpucu**: GitHub ile giriş yaparsanız daha hızlı olur.

### 1.3 Email Doğrulama
- Email ile kayıt olduysanız, gelen maili onaylayın
- GitHub/Google ile giriş yaptıysanız bu adımı atlayın

---

## 📦 ADIM 2: Yeni Proje Oluşturma (3 dakika)

### 2.1 Dashboard'a Gidin
Kayıt olduktan sonra Supabase Dashboard'unu göreceksiniz.

### 2.2 "New Project" Butonuna Tıklayın
Sol üstte **"New project"** yazısını göreceksiniz, tıklayın.

### 2.3 Proje Bilgilerini Doldurun

**Organization seçin:**
- Eğer ilk kez kullanıyorsanız, otomatik bir organization oluşturulacak
- "Personal" seçeneğini kullanabilirsiniz

**Proje Bilgileri:**

1. **Name (İsim):**
   ```
   barberpro
   ```
   (veya istediğiniz bir isim)

2. **Database Password (Şifre):**
   - Güçlü bir şifre oluşturun (en az 12 karakter)
   - **ÖNEMLİ**: Bu şifreyi bir yere kaydedin! (Not defteri, şifre yöneticisi)
   - Örnek: `BarberPro2024!Secure`

3. **Region (Bölge):**
   - Size en yakın bölgeyi seçin
   - Türkiye için önerilen: **Frankfurt (eu-central-1)**
   - Diğer seçenekler: London, Paris

4. **Pricing Plan:**
   - **Free** seçeneğini seçin (başlangıç için yeterli)
   - Aylık 500MB veritabanı + 2GB bandwidth

### 2.4 "Create new project" Butonuna Tıklayın

Proje oluşturulması **1-2 dakika** sürer. Bekleyin... ☕

---

## 🔑 ADIM 3: API Anahtarlarını Alma (2 dakika)

Proje hazır olduğunda:

### 3.1 Settings'e Gidin
1. Sol menüden **⚙️ Settings** (Ayarlar) seçeneğine tıklayın
2. Alt menüden **API** seçeneğine tıklayın

### 3.2 Anahtarları Kopyalayın

Sayfada 3 önemli bilgi göreceksiniz:

#### A) Project URL
```
https://xxxxxxxxxxx.supabase.co
```
- Bu sizin projenizin adresi
- `xxxxxxxxxxx` kısmı sizin proje ID'niz

#### B) anon public (API Key)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```
- Çok uzun bir metin (JWT token)
- Public key - güvenli, paylaşılabilir

#### C) service_role (Secret Key)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```
- Çok uzun bir metin (JWT token)
- **ÖNEMLİ**: Bu anahtarı ASLA paylaşmayın!
- Admin yetkilerine sahip

### 3.3 Anahtarları Kaydedin
Bu 3 bilgiyi bir yere kopyalayın (Not defteri, Word, vb.)

---

## 💻 ADIM 4: Projeye Anahtarları Ekleme (1 dakika)

### 4.1 .env.local Dosyasını Açın
Proje klasöründe `.env.local` dosyasını açın.

### 4.2 Anahtarları Yapıştırın

Dosyayı şu şekilde düzenleyin:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

**Değiştirmeniz gerekenler:**
- `https://xxxxxxxxxxx.supabase.co` → Kendi Project URL'nizi
- İlk uzun metin → Kendi anon public key'inizi
- İkinci uzun metin → Kendi service_role key'inizi

### 4.3 Dosyayı Kaydedin
`Ctrl + S` ile kaydedin.

---

## 🗄️ ADIM 5: Veritabanı Tablolarını Oluşturma (3 dakika)

### 5.1 SQL Editor'ü Açın
1. Supabase Dashboard'da sol menüden **🔧 SQL Editor** seçeneğine tıklayın
2. **"New query"** butonuna tıklayın

### 5.2 Schema SQL'ini Kopyalayın
1. Proje klasöründe `supabase/schema.sql` dosyasını açın
2. **TÜM İÇERİĞİ** kopyalayın (`Ctrl + A` sonra `Ctrl + C`)

### 5.3 SQL Editor'e Yapıştırın
1. Supabase SQL Editor'deki boş alana yapıştırın (`Ctrl + V`)
2. Sağ üstteki **"RUN"** butonuna tıklayın (veya `Ctrl + Enter`)

### 5.4 Sonucu Kontrol Edin
Altta şu mesajı görmelisiniz:
```
Success. No rows returned
```

Bu, tabloların başarıyla oluşturulduğu anlamına gelir! ✅

### 5.5 Tabloları Görüntüleyin
1. Sol menüden **📊 Table Editor** seçeneğine tıklayın
2. Şu tabloları görmelisiniz:
   - ✅ users
   - ✅ employees
   - ✅ services
   - ✅ appointments
   - ✅ business_settings

---

## 🎨 ADIM 6: Örnek Verileri Yükleme (Opsiyonel - 2 dakika)

### 6.1 Yeni SQL Query Açın
1. **SQL Editor** > **"New query"**

### 6.2 Seed SQL'ini Çalıştırın
1. `supabase/seed.sql` dosyasını açın
2. İçeriği kopyalayın
3. SQL Editor'e yapıştırın
4. **"RUN"** butonuna tıklayın

Bu, örnek hizmetler ve işletme bilgilerini ekler.

---

## ✅ ADIM 7: Test Etme

### 7.1 Dev Sunucusunu Yeniden Başlatın

Terminal'de:
```bash
# Önce durdurun (Ctrl + C)
# Sonra yeniden başlatın
npm run dev
```

### 7.2 Tarayıcıda Açın
```
http://localhost:3000
```

### 7.3 Kontrol Edin
- ✅ Sayfa yükleniyor mu?
- ✅ Hata mesajı yok mu?
- ✅ Ana sayfa düzgün görünüyor mu?

---

## 🎉 TAMAMLANDI!

Artık Supabase projeniz hazır! Şimdi yapabilecekleriniz:

### Sırada Ne Var?

1. **Kullanıcı Kaydı Yapın**
   - `http://localhost:3000/auth/register` adresine gidin
   - İlk kullanıcınızı oluşturun

2. **Admin Yetkisi Verin**
   - Supabase Dashboard > Table Editor > users
   - Oluşturduğunuz kullanıcının `role` sütununu `admin` yapın

3. **Hizmetleri Görüntüleyin**
   - `http://localhost:3000/services` sayfasına gidin
   - Örnek hizmetleri göreceksiniz

---

## ❓ Sık Sorulan Sorular

### S: Supabase ücretsiz mi?
**C:** Evet! Free tier ile başlayabilirsiniz:
- 500MB veritabanı
- 2GB bandwidth
- 50,000 monthly active users
- Küçük projeler için yeterli

### S: Kredi kartı gerekiyor mu?
**C:** Hayır! Free tier için kredi kartı gerekmez.

### S: Şifremi unuttum, ne yapmalıyım?
**C:** Supabase Dashboard > Settings > Database'de şifrenizi sıfırlayabilirsiniz.

### S: API anahtarlarımı kaybettim!
**C:** Settings > API sayfasından tekrar görebilirsiniz.

### S: Hata alıyorum: "Invalid API key"
**C:** `.env.local` dosyasındaki anahtarları kontrol edin. Boşluk veya satır sonu olmamalı.

---

## 🆘 Sorun mu Yaşıyorsunuz?

### Hata: "Invalid supabaseUrl"
- `.env.local` dosyasında URL'nin `https://` ile başladığından emin olun
- URL'nin sonunda `/` olmamalı

### Hata: "Failed to fetch"
- İnternet bağlantınızı kontrol edin
- Supabase projesi aktif mi kontrol edin (Dashboard'da)

### Hata: "Database error"
- SQL schema'yı doğru çalıştırdınız mı?
- Table Editor'de tabloları görebiliyor musunuz?

---

## 📞 Yardım

Hala sorun yaşıyorsanız:
1. Terminal'deki hata mesajını okuyun
2. Supabase Dashboard'da Logs bölümüne bakın
3. `.env.local` dosyasını tekrar kontrol edin

---

**Başarılar! 🚀**

Bu rehberi takip ederek Supabase'i başarıyla kurabilirsiniz.
