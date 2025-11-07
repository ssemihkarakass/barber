# 🚀 BarberPro 2.0 - Kurulum Rehberi

Bu rehber, BarberPro 2.0 projesini sıfırdan kurmak için gereken tüm adımları içerir.

## 📋 Ön Gereksinimler

- Node.js 18+ yüklü olmalı
- npm veya yarn paket yöneticisi
- Supabase hesabı (ücretsiz)
- Git (opsiyonel)

## 🎯 Adım 1: Supabase Projesi Oluşturma

### 1.1 Supabase'e Kaydolun

1. [https://supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub, Google veya email ile kayıt olun

### 1.2 Yeni Proje Oluşturun

1. Dashboard'da "New Project" butonuna tıklayın
2. Proje bilgilerini girin:
   - **Name**: BarberPro (veya istediğiniz isim)
   - **Database Password**: Güçlü bir şifre oluşturun (kaydedin!)
   - **Region**: Size en yakın bölgeyi seçin (örn: Frankfurt)
   - **Pricing Plan**: Free tier yeterli
3. "Create new project" butonuna tıklayın
4. Proje oluşturulmasını bekleyin (1-2 dakika)

### 1.3 API Anahtarlarını Alın

1. Sol menüden **Settings** > **API** bölümüne gidin
2. Şu bilgileri kopyalayın:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY) - ⚠️ Bu anahtarı asla paylaşmayın!

## 🗄️ Adım 2: Veritabanı Kurulumu

### 2.1 SQL Editor'ü Açın

1. Sol menüden **SQL Editor** seçeneğine tıklayın
2. "New query" butonuna tıklayın

### 2.2 Schema'yı Oluşturun

1. `supabase/schema.sql` dosyasının içeriğini kopyalayın
2. SQL Editor'e yapıştırın
3. Sağ üstteki **RUN** butonuna tıklayın
4. "Success. No rows returned" mesajını görmelisiniz

### 2.3 Örnek Verileri Yükleyin (Opsiyonel)

1. Yeni bir query açın
2. `supabase/seed.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'e yapıştırın
4. **RUN** butonuna tıklayın

### 2.4 Tabloları Kontrol Edin

1. Sol menüden **Table Editor** seçeneğine tıklayın
2. Şu tabloları görmelisiniz:
   - users
   - employees
   - services
   - appointments
   - business_settings

## ⚙️ Adım 3: Proje Yapılandırması

### 3.1 Environment Variables

1. Proje klasöründe `.env.local` dosyasını açın
2. Supabase'den aldığınız bilgileri girin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **ÖNEMLİ**: 
- `your-project-id` kısmını kendi proje ID'nizle değiştirin
- Anahtarları tırnak işareti olmadan yapıştırın
- `.env.local` dosyasını asla Git'e commit etmeyin

### 3.2 Bağımlılıkları Kontrol Edin

Tüm paketler zaten yüklü olmalı. Eğer değilse:

```bash
npm install
```

## 🎨 Adım 4: İlk Kullanıcıyı Oluşturma

### 4.1 Admin Kullanıcısı

1. Tarayıcıda `http://localhost:3000/auth/register` adresine gidin
2. Admin hesabı için kayıt olun:
   - **Ad Soyad**: Admin User
   - **E-posta**: admin@barberpro.com
   - **Telefon**: +90 5XX XXX XX XX
   - **Şifre**: Güçlü bir şifre
3. Kayıt olduktan sonra e-posta doğrulaması gerekebilir

### 4.2 Admin Rolü Atama

1. Supabase Dashboard'a dönün
2. **Table Editor** > **users** tablosuna gidin
3. Az önce oluşturduğunuz kullanıcıyı bulun
4. `role` sütununu `admin` olarak değiştirin
5. **Save** butonuna tıklayın

### 4.3 Çalışan Kullanıcıları Oluşturma

1. Her çalışan için yeni bir hesap oluşturun (register sayfasından)
2. Supabase'de `role` değerini `employee` olarak değiştirin
3. **employees** tablosuna kayıt ekleyin:

```sql
INSERT INTO employees (user_id, specialization, working_days, start_hour, end_hour, bio)
VALUES (
  'user-uuid-buraya',
  'Saç Kesimi Uzmanı',
  ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  '09:00',
  '18:00',
  'Saç kesimi ve şekillendirme konusunda 10 yıllık deneyim'
);
```

## 🧪 Adım 5: Test Etme

### 5.1 Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

### 5.2 Sayfaları Test Edin

1. **Ana Sayfa**: http://localhost:3000
2. **Hizmetler**: http://localhost:3000/services
3. **Ekip**: http://localhost:3000/team
4. **Takvim**: http://localhost:3000/calendar
5. **Giriş**: http://localhost:3000/auth/login
6. **Dashboard**: http://localhost:3000/dashboard (giriş yaptıktan sonra)

### 5.3 Fonksiyonları Test Edin

- [ ] Kullanıcı kaydı çalışıyor mu?
- [ ] Giriş yapılabiliyor mu?
- [ ] Takvim görüntüleniyor mu?
- [ ] Hizmetler listeleniyor mu?
- [ ] Ekip üyeleri görünüyor mu?
- [ ] Dashboard'a erişilebiliyor mu?

## 🚀 Adım 6: Production'a Alma

### 6.1 Vercel'e Deploy

1. [Vercel](https://vercel.com) hesabı oluşturun
2. "New Project" butonuna tıklayın
3. GitHub repository'nizi bağlayın (veya manuel import)
4. Environment Variables ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. "Deploy" butonuna tıklayın

### 6.2 Domain Bağlama

1. Vercel Dashboard'da projenize gidin
2. **Settings** > **Domains** seçeneğine tıklayın
3. Kendi domain'inizi ekleyin
4. DNS ayarlarını yapın

## 🔧 Sorun Giderme

### Supabase Bağlantı Hatası

```
Error: Invalid Supabase URL
```

**Çözüm**: `.env.local` dosyasındaki URL'yi kontrol edin. `https://` ile başlamalı.

### Authentication Hatası

```
Error: Invalid login credentials
```

**Çözüm**: 
1. E-posta doğrulaması yapıldı mı kontrol edin
2. Supabase Dashboard > Authentication > Users bölümünden kullanıcıyı kontrol edin

### Takvim Görünmüyor

**Çözüm**: 
1. Browser console'da hata var mı kontrol edin
2. FullCalendar paketleri yüklü mü kontrol edin: `npm list @fullcalendar`

### Build Hatası

```
Error: Module not found
```

**Çözüm**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📚 Ek Kaynaklar

- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [TailwindCSS Dokümantasyonu](https://tailwindcss.com/docs)
- [FullCalendar Dokümantasyonu](https://fullcalendar.io/docs)

## 💡 İpuçları

1. **Geliştirme Sırasında**: Her zaman `npm run dev` ile çalışın
2. **Production'da**: `npm run build` ile build alın ve test edin
3. **Veritabanı Değişiklikleri**: SQL Editor'de her değişikliği test edin
4. **Güvenlik**: Service role key'i asla client-side kodda kullanmayın
5. **Backup**: Düzenli olarak veritabanı backup'ı alın

## 🎉 Tebrikler!

BarberPro 2.0 projeniz artık çalışıyor! Herhangi bir sorun yaşarsanız:

1. Console loglarını kontrol edin
2. Supabase Dashboard'da hataları inceleyin
3. README.md dosyasını okuyun
4. GitHub Issues'da sorun açın

---

**BarberPro 2.0** ile başarılar dileriz! 💈
