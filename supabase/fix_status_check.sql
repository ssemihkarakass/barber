-- FIX: appointments_status_check hatası
-- Sorun: 'completed' status'u check constraint'te yok

-- 1. Önce mevcut constraint'i kaldır
ALTER TABLE public.appointments 
DROP CONSTRAINT IF EXISTS appointments_status_check;

-- 2. Yeni constraint ekle (completed dahil)
ALTER TABLE public.appointments 
ADD CONSTRAINT appointments_status_check 
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- 3. Kontrol et
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.appointments'::regclass 
AND conname = 'appointments_status_check';
