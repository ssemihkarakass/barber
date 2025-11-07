-- RLS POLİTİKALARINI DÜZELT
-- Bu dosyayı Supabase SQL Editor'de çalıştır

-- 1. Employees tablosu için okuma izni (406 hatasını düzeltir)
DROP POLICY IF EXISTS "Allow read employees" ON employees;
CREATE POLICY "Allow read employees" ON employees
FOR SELECT
TO authenticated, anon
USING (true);

-- 2. Users tablosu için okuma izni
DROP POLICY IF EXISTS "Allow read users" ON users;
CREATE POLICY "Allow read users" ON users
FOR SELECT
TO authenticated, anon
USING (true);

-- 3. Services tablosu için okuma izni
DROP POLICY IF EXISTS "Allow read services" ON services;
CREATE POLICY "Allow read services" ON services
FOR SELECT
TO authenticated, anon
USING (true);

-- 4. Appointments tablosu için okuma izni
DROP POLICY IF EXISTS "Allow read appointments" ON appointments;
CREATE POLICY "Allow read appointments" ON appointments
FOR SELECT
TO authenticated
USING (true);

-- 5. Users tablosu için kendi kaydını güncelleme
DROP POLICY IF EXISTS "Allow update own user" ON users;
CREATE POLICY "Allow update own user" ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 6. Appointments tablosu için kendi randevusunu oluşturma
DROP POLICY IF EXISTS "Allow insert own appointment" ON appointments;
CREATE POLICY "Allow insert own appointment" ON appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = customer_id);

-- 7. Appointments tablosu için kendi randevusunu güncelleme
DROP POLICY IF EXISTS "Allow update own appointment" ON appointments;
CREATE POLICY "Allow update own appointment" ON appointments
FOR UPDATE
TO authenticated
USING (auth.uid() = customer_id);

-- Kontrol et
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
