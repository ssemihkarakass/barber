# 🔧 ROL KONTROLÜ NASIL YAPILIR?

## ❗ SORUN: Admin rolü olsa bile dashboard'a yönlendiriyor

### Olası Sebepler:

1. **Supabase'de rol güncellenmemiş**
2. **Cache sorunu**
3. **Session yenilenmemiş**

---

## ✅ ÇÖZÜM ADIMLARI

### 1. Supabase'de Rolü Kontrol Et

**Adım 1:** Supabase Dashboard'a git
- https://supabase.com/dashboard

**Adım 2:** Projenizi seçin

**Adım 3:** Table Editor → `users` tablosuna git

**Adım 4:** Email'inizi bulun ve `role` sütununu kontrol et

**Adım 5:** Eğer `customer` ise, düzenle:
```
role = admin
```

**Adım 6:** Save butonuna bas

---

### 2. SQL ile Rol Ver (Daha Garantili)

**SQL Editor'ü aç ve çalıştır:**

```sql
-- Email'inizi buraya yazın
UPDATE users 
SET role = 'admin' 
WHERE email = 'furkan@furkanemer.com';

-- Kontrol et
SELECT id, email, name, role 
FROM users 
WHERE email = 'furkan@furkanemer.com';
```

Sonuç:
```
role: admin
```
görünmeli!

---

### 3. Employee Kaydı Oluştur

Admin olsan bile, employee tablosunda kayıt olmalısın:

```sql
-- Önce user_id'ni al
SELECT id FROM users WHERE email = 'furkan@furkanemer.com';

-- Sonra employee kaydı oluştur (user_id'yi yukarıdan kopyala)
INSERT INTO employees (user_id, specialization, start_hour, end_hour, is_active)
VALUES (
  'BURAYA_USER_ID_YAPISTIR',
  'Saç Kesimi & Sakal Uzmanı',
  '09:00',
  '20:00',
  true
);
```

VEYA tek sorguda:

```sql
INSERT INTO employees (user_id, specialization, start_hour, end_hour, is_active)
SELECT id, 'Saç Kesimi & Sakal Uzmanı', '09:00', '20:00', true 
FROM users 
WHERE email = 'furkan@furkanemer.com'
ON CONFLICT (user_id) DO NOTHING;
```

---

### 4. Tarayıcıyı Temizle

**Önemli:** Cache sorunu olabilir!

**Chrome/Edge:**
1. `Ctrl + Shift + Delete`
2. "Cached images and files" seç
3. "Clear data"

**Veya:**
1. `F12` (Developer Tools)
2. Application → Storage → Clear site data

---

### 5. Çıkış Yap ve Tekrar Giriş Yap

**Çok Önemli!**

1. Sağ üstteki "Çıkış" butonuna bas
2. `/auth/login` sayfasına git
3. Email ve şifrenle tekrar giriş yap
4. Otomatik olarak `/admin` sayfasına yönlendirilmelisin

---

### 6. Console'u Kontrol Et

**F12** → **Console** sekmesine bak

Şunları göreceksin:
```
User role: admin
Redirecting to admin
```

Eğer farklı bir şey görüyorsan, o bilgiyi bana söyle!

---

## 🔍 DEBUG - Rolü Kontrol Et

Tarayıcı console'unda çalıştır:

```javascript
// Supabase client oluştur
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
)

// Mevcut kullanıcıyı al
const { data: { user } } = await supabase.auth.getUser()
console.log('Auth User:', user)

// Users tablosundan rol al
const { data: userData } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single()

console.log('User Data:', userData)
console.log('Role:', userData.role)
```

---

## ✅ KONTROL LİSTESİ

- [ ] Supabase'de `users` tablosunda `role = 'admin'` olduğunu gördüm
- [ ] SQL ile kontrol ettim, `admin` yazıyor
- [ ] `employees` tablosunda kayıt var
- [ ] Tarayıcı cache'ini temizledim
- [ ] Çıkış yapıp tekrar giriş yaptım
- [ ] Console'da "User role: admin" görüyorum
- [ ] Hala `/dashboard`'a yönlendiriyor

Eğer tüm bunları yaptıysan ve hala sorun varsa:
1. Console'daki hata mesajını bana gönder
2. Supabase'deki user kaydının screenshot'ını al

---

## 🚨 ACİL ÇÖZÜM

Eğer hiçbir şey işe yaramıyorsa:

1. **Yeni bir admin hesabı oluştur:**
```sql
-- Önce auth.users'a manuel ekle (Supabase Dashboard → Authentication → Users → Add User)
-- Email: admin@test.com
-- Password: admin123

-- Sonra role ver
UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';

-- Employee kaydı oluştur
INSERT INTO employees (user_id, specialization, start_hour, end_hour, is_active)
SELECT id, 'Admin', '09:00', '20:00', true 
FROM users WHERE email = 'admin@test.com';
```

2. Bu hesapla giriş yap
3. `/admin` sayfasına gidebiliyor musun?

---

## 📞 DESTEK

Hala sorun varsa, bana şunları gönder:
1. Console'daki log'lar
2. Supabase'deki user kaydı (screenshot)
3. Hangi email ile giriş yaptığın

**Çözeceğiz kanka!** 🔧
