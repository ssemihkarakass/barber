# 🚢 BarberPro 2.0 - Deployment Rehberi

Bu dokümantasyon, BarberPro 2.0 projesini production ortamına deploy etmek için gereken adımları içerir.

## 📋 Deployment Öncesi Kontrol Listesi

- [ ] Tüm environment variables hazır
- [ ] Supabase production veritabanı kuruldu
- [ ] Tüm testler başarılı
- [ ] Build hatası yok (`npm run build`)
- [ ] SEO meta tagları eklendi
- [ ] Analytics kuruldu (opsiyonel)
- [ ] Error tracking kuruldu (opsiyonel)

## 🎯 Vercel ile Deployment (Önerilen)

### Neden Vercel?

- Next.js'in yaratıcıları tarafından geliştirildi
- Otomatik SSL sertifikası
- Global CDN
- Otomatik preview deployments
- Ücretsiz tier mevcut

### Adım 1: Vercel Hesabı Oluşturma

1. [https://vercel.com](https://vercel.com) adresine gidin
2. "Sign Up" butonuna tıklayın
3. GitHub, GitLab veya Bitbucket ile giriş yapın

### Adım 2: Proje Import Etme

#### Seçenek A: GitHub Repository'den

1. Vercel Dashboard'da "Add New" > "Project" seçin
2. GitHub repository'nizi seçin
3. "Import" butonuna tıklayın

#### Seçenek B: Manuel Import

1. "Add New" > "Project" seçin
2. "Import Git Repository" yerine "Deploy from CLI" seçin
3. Vercel CLI'yi yükleyin:

```bash
npm install -g vercel
```

4. Proje klasöründe:

```bash
vercel
```

### Adım 3: Environment Variables Ekleme

1. Vercel Dashboard'da projenize gidin
2. **Settings** > **Environment Variables** seçin
3. Şu değişkenleri ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
```

⚠️ **ÖNEMLİ**: 
- Production, Preview ve Development için ayrı ayrı ekleyin
- Service role key'i asla public etmeyin

### Adım 4: Build Settings

Vercel otomatik olarak algılar, ama kontrol edin:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Adım 5: Deploy

1. "Deploy" butonuna tıklayın
2. Build sürecini izleyin (2-5 dakika)
3. Deploy tamamlandığında URL'yi alın

### Adım 6: Domain Bağlama

1. **Settings** > **Domains** seçin
2. "Add" butonuna tıklayın
3. Domain'inizi girin (örn: barberpro.com)
4. DNS ayarlarını yapın:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. SSL sertifikası otomatik oluşturulacak (5-10 dakika)

## 🐳 Docker ile Deployment

### Dockerfile Oluşturma

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  barberpro:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
```

### Build ve Run

```bash
# Build
docker build -t barberpro .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  -e SUPABASE_SERVICE_ROLE_KEY=your-key \
  barberpro

# Docker Compose ile
docker-compose up -d
```

## ☁️ AWS ile Deployment

### AWS Amplify

1. AWS Console'da Amplify'a gidin
2. "New app" > "Host web app" seçin
3. GitHub repository'nizi bağlayın
4. Build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

5. Environment variables ekleyin
6. "Save and deploy"

## 🌐 Netlify ile Deployment

1. [Netlify](https://netlify.com) hesabı oluşturun
2. "Add new site" > "Import an existing project"
3. GitHub repository'nizi seçin
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Environment variables ekleyin
6. "Deploy site"

## 📊 Post-Deployment Kontroller

### 1. Fonksiyonel Testler

- [ ] Ana sayfa yükleniyor
- [ ] Tüm sayfalar erişilebilir
- [ ] Giriş/kayıt çalışıyor
- [ ] Takvim görüntüleniyor
- [ ] API istekleri başarılı

### 2. Performance Testler

```bash
# Lighthouse ile test
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

Hedef skorlar:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### 3. SEO Kontrolleri

- [ ] Meta tagları doğru
- [ ] Sitemap.xml oluşturuldu
- [ ] Robots.txt yapılandırıldı
- [ ] Open Graph tagları eklendi
- [ ] Schema.org markup eklendi

### 4. Güvenlik Kontrolleri

- [ ] HTTPS aktif
- [ ] Security headers yapılandırıldı
- [ ] API keys güvenli
- [ ] CORS ayarları doğru
- [ ] Rate limiting aktif

## 🔄 CI/CD Pipeline

### GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📈 Monitoring ve Analytics

### 1. Vercel Analytics

```bash
npm install @vercel/analytics
```

`app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Google Analytics

```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = 'G-XXXXXXXXXX'

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}
```

### 3. Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

## 🔐 Güvenlik Best Practices

### 1. Environment Variables

- Asla `.env.local` dosyasını commit etmeyin
- Production'da farklı anahtarlar kullanın
- Service role key'i sadece server-side kullanın

### 2. Security Headers

`next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

### 3. Rate Limiting

Supabase'de rate limiting aktif edin:
- Dashboard > Settings > API
- Rate limiting ayarlarını yapılandırın

## 🆘 Sorun Giderme

### Build Hatası

```bash
# Cache temizle
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Hatası

- Vercel Dashboard'da kontrol edin
- Tüm environment'lar için eklendi mi?
- Değerler doğru mu?

### Database Bağlantı Hatası

- Supabase URL doğru mu?
- API keys geçerli mi?
- RLS politikaları doğru mu?

## 📞 Destek

Sorun yaşarsanız:

1. [GitHub Issues](https://github.com/your-repo/issues)
2. [Vercel Support](https://vercel.com/support)
3. [Supabase Discord](https://discord.supabase.com)

---

**BarberPro 2.0** - Production'a hazır! 🚀
