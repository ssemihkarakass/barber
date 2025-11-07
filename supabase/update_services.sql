-- Furkan Emer 2025 Güncel Fiyat Listesi
-- Önce mevcut hizmetleri temizle
DELETE FROM public.services;

-- Yeni hizmetleri ekle
INSERT INTO public.services (name, description, price, duration, category, is_active) VALUES
-- Temel Hizmetler
('SAÇ', 'Profesyonel saç kesimi', 400, 30, 'Temel Hizmetler', true),
('SAKAL', 'Sakal kesimi ve şekillendirme', 100, 20, 'Temel Hizmetler', true),
('YIKAMA+FÖN', 'Saç yıkama ve fön', 100, 15, 'Temel Hizmetler', true),
('SAÇ+SAKAL+YIKAMA+FÖN', 'Komple bakım paketi', 500, 60, 'Paket Hizmetler', true),
('SAÇ+SAKAL+YIKAMA+FÖN+YÜZ BAKIM+SAÇ BAKIM', 'Premium bakım paketi', 600, 90, 'Paket Hizmetler', true),

-- Bakım Hizmetleri
('YÜZ MASKESİ', 'Yüz maskesi uygulaması', 100, 20, 'Bakım Hizmetleri', true),
('SAÇ MASKESİ', 'Saç maskesi uygulaması', 100, 20, 'Bakım Hizmetleri', true),
('BUHAR MAKİNELİ YÜZ MASKESİ', 'Buhar makineli yüz maskesi', 150, 30, 'Bakım Hizmetleri', true),
('SAÇ BOYAMA', 'Profesyonel saç boyama', 300, 60, 'Bakım Hizmetleri', true),
('AĞDA', 'Ağda uygulaması', 50, 15, 'Bakım Hizmetleri', true),

-- Özel Hizmetler
('DAMAT TRAŞI', 'Özel gün damat traşı', 2500, 120, 'Özel Hizmetler', true),
('ÇOCUK TRAŞI', 'Çocuk saç kesimi', 300, 25, 'Özel Hizmetler', true);
