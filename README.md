# 💈 BarberPro 2.0

Profesyonel, modern ve SEO uyumlu berber işletme web platformu.

## 🎯 Özellikler

- ✅ Modern ve responsive tasarım (Next.js 16 + TailwindCSS)
- ✅ Supabase ile güçlü backend (PostgreSQL + Auth + Realtime)
- ✅ FullCalendar.js ile interaktif randevu takvimi
- ✅ Kullanıcı rolleri (Müşteri, Çalışan, Admin)
- ✅ Gerçek zamanlı randevu yönetimi
- ✅ Hizmet ve fiyat listesi yönetimi
- ✅ Çalışan profilleri ve çalışma saatleri
- ✅ SEO optimize edilmiş sayfalar

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Supabase Projesini Kurun

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. SQL Editor'de `supabase/schema.sql` dosyasını çalıştırın
4. (Opsiyonel) `supabase/seed.sql` ile örnek verileri yükleyin

### 3. Environment Variables

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📁 Proje Yapısı

```
berber/
├── app/                      # Next.js App Router
│   ├── auth/                # Auth sayfaları (login, register)
│   ├── calendar/            # Takvim sayfası
│   ├── dashboard/           # Kullanıcı paneli
│   ├── services/            # Hizmetler sayfası
│   ├── team/                # Ekip sayfası
│   └── page.tsx             # Ana sayfa
├── components/              # React bileşenleri
│   ├── calendar/            # Takvim bileşenleri
│   ├── layout/              # Layout bileşenleri (Navbar, Footer)
│   └── ui/                  # UI bileşenleri (Button, Card, etc.)
├── lib/                     # Utility fonksiyonlar
│   ├── supabase/            # Supabase client yapılandırması
│   └── types/               # TypeScript type tanımları
├── supabase/                # Veritabanı şemaları
│   ├── schema.sql           # Tablo tanımları ve RLS politikaları
│   └── seed.sql             # Örnek veriler
└── public/                  # Statik dosyalar
```

## 🗄️ Veritabanı Şeması

### Tablolar

- **users**: Kullanıcı bilgileri (müşteri, çalışan, admin)
- **employees**: Çalışan detayları ve çalışma saatleri
- **services**: Hizmet listesi ve fiyatlar
- **appointments**: Randevu kayıtları
- **business_settings**: İşletme ayarları

## 👥 Kullanıcı Rolleri

### Müşteri (Customer)
- Takvimi görüntüleme
- Randevu alma
- Randevu iptal etme
- Profil düzenleme

### Çalışan (Employee)
- Kendi takvimini görüntüleme
- Randevuları onaylama/reddetme
- Çalışma saatlerini ayarlama
- Müşteri notları ekleme

### Admin
- Tüm randevuları görüntüleme ve yönetme
- Çalışan ekleme/çıkarma
- Hizmet yönetimi (CRUD)
- İşletme ayarları
- İstatistikler ve raporlar

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Arka Plan**: Siyah (#0D0D0D)
- **Ana Vurgu**: Altın (#D4AF37)
- **Yardımcı Renk**: Kırmızı (#B22222)
- **Yazı**: Beyaz (#FFFFFF)

### Fontlar
- **Başlıklar**: Cinzel
- **Metin**: Poppins

## 🔐 Güvenlik

- Row Level Security (RLS) politikaları aktif
- JWT tabanlı authentication
- Rol bazlı yetkilendirme
- Güvenli API endpoint'leri

## 📱 Responsive Tasarım

Tüm sayfalar mobil, tablet ve desktop için optimize edilmiştir.

## 🚢 Deployment

### Vercel (Önerilen)

```bash
npm run build
```

Vercel'e deploy edin ve environment variables'ları ekleyin.

### Diğer Platformlar

Next.js'in desteklediği herhangi bir platformda deploy edilebilir.

## 📝 Yapılacaklar

- [ ] E-posta bildirimleri
- [ ] SMS bildirimleri
- [ ] Ödeme entegrasyonu
- [ ] Müşteri puanlama sistemi
- [ ] Çoklu dil desteği
- [ ] Dark/Light mode toggle
- [ ] PDF randevu fişi
- [ ] Google Calendar entegrasyonu

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için lütfen önce bir issue açın.

## 📄 Lisans

MIT

## 📞 İletişim

Sorularınız için: info@barberpro.com

---

**BarberPro 2.0** - Modern Berber Yönetim Sistemi
