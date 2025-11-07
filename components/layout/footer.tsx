import Link from 'next/link'
import { Scissors, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Scissors className="w-8 h-8 text-[#C4A747]" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#C4A747] to-[#D4B857] bg-clip-text text-transparent">
                Furkan Emer
              </span>
            </div>
            <p className="text-zinc-400 text-sm">
              Profesyonel erkek kuaförü ve bakım merkezi. Modern tarzda hizmet veren, deneyimli ekibimizle sizlere en iyi hizmeti sunuyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-[#C4A747] transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-zinc-400 hover:text-[#C4A747] transition-colors">
                  Takvim
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-zinc-400 hover:text-[#C4A747] transition-colors">
                  Hizmetler
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-zinc-400 hover:text-[#C4A747] transition-colors">
                  Ekibimiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>Saç Kesimi</li>
              <li>Sakal Düzeltme</li>
              <li>Cilt Bakımı</li>
              <li>Saç Boyama</li>
              <li>Özel Gün Paketi</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-zinc-400 text-sm">
                <MapPin className="w-5 h-5 text-[#C4A747] flex-shrink-0 mt-0.5" />
                <span>Atatürk Caddesi No:123, İstanbul</span>
              </li>
              <li className="flex items-center space-x-3 text-zinc-400 text-sm">
                <Phone className="w-5 h-5 text-[#C4A747] flex-shrink-0" />
                <span>+90 212 555 0123</span>
              </li>
              <li className="flex items-center space-x-3 text-zinc-400 text-sm">
                <Mail className="w-5 h-5 text-[#C4A747] flex-shrink-0" />
                <span>info@barberpro.com</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex items-center space-x-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-[#C4A747] hover:text-black transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-[#C4A747] hover:text-black transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-[#C4A747] hover:text-black transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Furkan Emer. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
