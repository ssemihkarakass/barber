'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Scissors, Star, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const team = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    role: 'Baş Berber',
    specialization: 'Saç Kesimi & Şekillendirme Uzmanı',
    experience: '15 yıl',
    bio: 'Saç kesimi ve şekillendirme konusunda 15 yıllık deneyime sahip. Modern ve klasik tarzlarda uzman.',
    workingDays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    workingHours: '09:00 - 18:00',
    rating: 4.9,
    image: '/team/member1.jpg',
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    role: 'Kıdemli Berber',
    specialization: 'Sakal & Cilt Bakımı Uzmanı',
    experience: '12 yıl',
    bio: 'Sakal bakımı ve şekillendirme konusunda uzman. Cilt bakımı ve yüz masajı sertifikalı.',
    workingDays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'],
    workingHours: '10:00 - 19:00',
    rating: 4.8,
    image: '/team/member2.jpg',
  },
  {
    id: 3,
    name: 'Can Öztürk',
    role: 'Berber',
    specialization: 'Modern Saç Tasarımı',
    experience: '8 yıl',
    bio: 'Modern saç kesimleri ve trend takibi konusunda uzman. Genç neslin tercihi.',
    workingDays: ['Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    workingHours: '11:00 - 20:00',
    rating: 4.7,
    image: '/team/member3.jpg',
  },
  {
    id: 4,
    name: 'Emre Kaya',
    role: 'Berber',
    specialization: 'Klasik Kesim & Traş',
    experience: '10 yıl',
    bio: 'Klasik berberlik sanatının ustası. Ustura traşı ve geleneksel yöntemlerde uzman.',
    workingDays: ['Pazartesi', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    workingHours: '09:00 - 18:00',
    rating: 4.9,
    image: '/team/member4.jpg',
  },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen py-4 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">Ekibimiz</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Deneyimli ve profesyonel ekibimizle size en iyi hizmeti sunuyoruz
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {team.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-48 h-64 md:h-auto bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center">
                  <Scissors className="w-24 h-24 text-black/20" />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
                      <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="text-white font-semibold">{member.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl md:text-2xl text-white mb-1">{member.name}</CardTitle>
                        <p className="text-[#D4AF37] font-semibold">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-zinc-400">Deneyim</p>
                        <p className="text-white font-semibold">{member.experience}</p>
                      </div>
                    </div>
                    <CardDescription className="mt-3">
                      <span className="text-[#D4AF37] font-semibold">{member.specialization}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 mb-4">{member.bio}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-zinc-500">Çalışma Günleri</p>
                          <p className="text-white text-sm">{member.workingDays.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-zinc-500">Çalışma Saatleri</p>
                          <p className="text-white text-sm">{member.workingHours}</p>
                        </div>
                      </div>
                    </div>

                    <Link href="/calendar">
                      <Button className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Randevu Al
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-6 md:mb-8">Neden Bizi Tercih Etmelisiniz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: 'Deneyimli Ekip',
                description: 'Yılların deneyimine sahip profesyonel berberlerimiz',
                icon: Star,
              },
              {
                title: 'Kaliteli Hizmet',
                description: 'En iyi ürünler ve modern tekniklerle hizmet',
                icon: Scissors,
              },
              {
                title: 'Müşteri Memnuniyeti',
                description: 'Müşteri memnuniyeti bizim için her zaman öncelikli',
                icon: Star,
              },
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <item.icon className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] border-none text-black">
            <CardContent className="p-12">
              <h2 className="text-xl md:text-2xl md:text-4xl font-bold mb-4">Ekibimizle Tanışın</h2>
              <p className="text-lg mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
                Profesyonel ekibimiz size en iyi hizmeti sunmak için hazır. Hemen randevu alın ve farkı yaşayın.
              </p>
              <Link href="/calendar">
                <Button size="lg" variant="secondary" className="text-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Randevu Al
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
