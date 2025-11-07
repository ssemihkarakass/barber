import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scissors, Clock, Users, Star, Calendar, MapPin, Phone } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#C4A747] via-[#D4B857] to-[#C4A747] bg-clip-text text-transparent animate-fade-in">
            Furkan Emer
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-2xl mx-auto">
            Profesyonel erkek kuaförü ve bakım merkezi. Modern tarzda hizmet veren, deneyimli ekibimizle sizlere en iyi hizmeti sunuyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calendar">
              <Button size="lg" className="text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Randevu Takvimine Göz At
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="text-lg">
                <Scissors className="w-5 h-5 mr-2" />
                Hizmetlerimiz
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-[#C4A747] rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-[#C4A747] rounded-full opacity-20 animate-pulse delay-1000" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Mutlu Müşteri', value: '5000+' },
              { icon: Scissors, label: 'Yıllık Deneyim', value: '15+' },
              { icon: Star, label: 'Uzman Berber', value: '8' },
              { icon: Clock, label: 'Çalışma Saati', value: '09:00-20:00' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-12 h-12 text-[#C4A747] mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Hakkımızda</h2>
          <p className="text-lg text-zinc-300 leading-relaxed">
            Furkan Emer, modern erkek bakımının tüm gereksinimlerini karşılayan profesyonel bir kuaför ve bakım merkezidir. 
            Deneyimli ekibimiz, en son trendleri takip ederek sizlere özel hizmet sunmaktadır. 
            Hijyen ve müşteri memnuniyeti bizim için her zaman önceliklidir.
          </p>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-zinc-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Popüler Hizmetlerimiz</h2>
            <p className="text-zinc-400 text-lg">En çok tercih edilen hizmetlerimiz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'SAÇ',
                description: 'Profesyonel saç kesimi',
                price: '400₺',
                duration: '30 dk',
              },
              {
                title: 'SAÇ+SAKAL+YIKAMA+FÖN',
                description: 'Komple bakım paketi',
                price: '500₺',
                duration: '60 dk',
              },
              {
                title: 'SAÇ+SAKAL+YIKAMA+FÖN+YÜZ BAKIM+SAÇ BAKIM',
                description: 'Premium bakım paketi',
                price: '600₺',
                duration: '90 dk',
              },
            ].map((service, index) => (
              <Card key={index} className="hover:scale-105 transition-transform cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-[#C4A747]">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-white">{service.price}</div>
                    <div className="flex items-center text-zinc-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button size="lg" variant="outline">
                Tüm Hizmetleri Gör
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <Card className="bg-gradient-to-r from-[#C4A747] to-[#D4B857] border-none text-black">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Randevunuzu Hemen Alın</h2>
            <p className="text-lg mb-8 opacity-90">
              Online randevu sistemi ile kolayca yerinizi ayırtın. Müsait saatleri görün ve size uygun zamanı seçin.
            </p>
            <Link href="/calendar">
              <Button size="lg" variant="secondary" className="text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Takvimi Görüntüle
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">İletişim</h2>
            <p className="text-zinc-400 text-lg">Bize ulaşın, size yardımcı olalım</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-[#C4A747] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Adres</h3>
              <p className="text-zinc-400">Atatürk Caddesi No:123<br />İstanbul</p>
            </div>
            <div className="text-center">
              <Phone className="w-12 h-12 text-[#C4A747] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Telefon</h3>
              <p className="text-zinc-400">+90 212 555 0123</p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 text-[#C4A747] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Çalışma Saatleri</h3>
              <p className="text-zinc-400">Pazartesi - Cumartesi<br />09:00 - 20:00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
