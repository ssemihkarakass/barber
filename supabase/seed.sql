-- Seed data for BarberPro 2.0
-- This file contains sample data for testing

-- Insert business settings
INSERT INTO public.business_settings (
  business_name,
  description,
  address,
  phone,
  email,
  open_days,
  closed_days,
  open_hour,
  close_hour,
  primary_color,
  secondary_color
) VALUES (
  'Furkan Emer Berber',
  'Profesyonel erkek kuaförü ve bakım merkezi. Modern tarzda hizmet veren, deneyimli ekibimizle sizlere en iyi hizmeti sunuyoruz.',
  'Atatürk Caddesi No:123, İstanbul',
  '+90 212 555 0123',
  'info@furkanemer.com',
  '{"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"}',
  '{"Sunday"}',
  '09:00',
  '20:00',
  '#D4AF37',
  '#B22222'
) ON CONFLICT DO NOTHING;

-- Insert sample services
INSERT INTO public.services (name, description, price, duration, category, is_active) VALUES
  ('Saç Kesimi', 'Profesyonel saç kesimi ve şekillendirme. Modern ve klasik tarzda kesim hizmeti.', 150.00, 30, 'Saç', TRUE),
  ('Sakal Düzeltme', 'Sakal kesimi, şekillendirme ve bakım. Yüz hatlarınıza uygun profesyonel sakal düzeltme.', 100.00, 20, 'Sakal', TRUE),
  ('Saç + Sakal Kombo', 'Saç kesimi ve sakal düzeltme kombine paket. Zamandan tasarruf edin.', 200.00, 45, 'Kombo', TRUE),
  ('Cilt Bakımı', 'Yüz temizliği, peeling ve maske uygulaması. Cildinizi yenileyin.', 200.00, 40, 'Bakım', TRUE),
  ('Saç Boyama', 'Profesyonel saç boyama hizmeti. Doğal ve kalıcı sonuçlar.', 250.00, 60, 'Saç', TRUE),
  ('Özel Gün Paketi', 'Düğün ve özel günler için komple bakım paketi. Saç, sakal, cilt bakımı dahil.', 400.00, 90, 'Özel', TRUE),
  ('Çocuk Saç Kesimi', '12 yaş altı çocuklar için saç kesimi', 100.00, 25, 'Saç', TRUE),
  ('Gelin Traşı', 'Özel gün traşı ve bakımı', 400.00, 90, 'Özel', TRUE)
ON CONFLICT DO NOTHING;

-- Note: User and employee data should be created through the application
-- as they require authentication setup. The following is just for reference:

-- Sample admin user (you need to create this through Supabase Auth first)
-- Then update the role:
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@barberpro.com';

-- Sample employee users (create through Supabase Auth first)
-- Then insert employee records:
-- INSERT INTO public.employees (user_id, specialization, working_days, start_hour, end_hour, bio)
-- VALUES 
--   ('user-uuid-1', 'Saç Kesimi Uzmanı', '{"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"}', '09:00', '18:00', 'Saç kesimi ve şekillendirme konusunda 10 yıllık deneyim'),
--   ('user-uuid-2', 'Sakal Uzmanı', '{"Monday","Tuesday","Wednesday","Thursday","Friday"}', '10:00', '19:00', 'Sakal bakımı ve şekillendirme konusunda uzman');
