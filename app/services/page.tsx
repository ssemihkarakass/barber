'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scissors, Clock, Star, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: false })
    
    if (data && data.length > 0) {
      setServices(data)
    } else {
      // Fallback data - Furkan Emer 2025 Fiyat Listesi
      setServices([
        // Temel Hizmetler
        { id: '1', name: 'SAÇ', description: 'Profesyonel saç kesimi', price: 400, duration: 30, category: 'Temel Hizmetler' },
        { id: '2', name: 'SAKAL', description: 'Sakal kesimi ve şekillendirme', price: 100, duration: 20, category: 'Temel Hizmetler' },
        { id: '3', name: 'YIKAMA+FÖN', description: 'Saç yıkama ve fön', price: 100, duration: 15, category: 'Temel Hizmetler' },
        
        // Paket Hizmetler
        { id: '4', name: 'SAÇ+SAKAL+YIKAMA+FÖN', description: 'Komple bakım paketi', price: 500, duration: 60, category: 'Paket Hizmetler' },
        { id: '5', name: 'SAÇ+SAKAL+YIKAMA+FÖN+YÜZ BAKIM+SAÇ BAKIM', description: 'Premium bakım paketi', price: 600, duration: 90, category: 'Paket Hizmetler' },
        
        // Bakım Hizmetleri
        { id: '6', name: 'YÜZ MASKESİ', description: 'Yüz maskesi uygulaması', price: 100, duration: 20, category: 'Bakım Hizmetleri' },
        { id: '7', name: 'SAÇ MASKESİ', description: 'Saç maskesi uygulaması', price: 100, duration: 20, category: 'Bakım Hizmetleri' },
        { id: '8', name: 'BUHAR MAKİNELİ YÜZ MASKESİ', description: 'Buhar makineli yüz maskesi', price: 150, duration: 30, category: 'Bakım Hizmetleri' },
        { id: '9', name: 'SAÇ BOYAMA', description: 'Profesyonel saç boyama', price: 300, duration: 60, category: 'Bakım Hizmetleri' },
        { id: '10', name: 'AĞDA', description: 'Ağda uygulaması', price: 50, duration: 15, category: 'Bakım Hizmetleri' },
        
        // Özel Hizmetler
        { id: '11', name: 'DAMAT TRAŞI', description: 'Özel gün damat traşı', price: 2500, duration: 120, category: 'Özel Hizmetler' },
        { id: '12', name: 'ÇOCUK TRAŞI', description: 'Çocuk saç kesimi', price: 300, duration: 25, category: 'Özel Hizmetler' },
      ])
    }
    setLoading(false)
  }

  const popularServices = services.filter(s => s.price >= 400)
  const regularServices = services.filter(s => s.price < 400)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C4A747] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Hizmetler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-4 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-xl md:text-2xl md:text-4xl md:text-5xl font-bold mb-4 text-white">Hizmetlerimiz</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Profesyonel ekibimiz ve kaliteli hizmetlerimizle sizlere en iyi deneyimi sunuyoruz.
          </p>
        </div>

        {/* Popular Services */}
        {popularServices.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <Star className="w-6 h-6 text-[#C4A747]" />
              <h2 className="text-3xl font-bold text-white">Popüler Hizmetler</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {popularServices.map((service, index) => (
                <Card 
                  key={service.id} 
                  className="hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-[#C4A747]/30 hover:border-[#C4A747] animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Scissors className="w-8 h-8 text-[#C4A747]" />
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    </div>
                    <CardTitle className="text-[#C4A747]">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-3xl font-bold text-white">{service.price}₺</div>
                      <div className="flex items-center text-zinc-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration} dk
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Services */}
        {regularServices.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <Scissors className="w-6 h-6 text-[#C4A747]" />
              <h2 className="text-3xl font-bold text-white">Tüm Hizmetler</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {regularServices.map((service, index) => (
                <Card 
                  key={service.id} 
                  className="hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <Scissors className="w-8 h-8 text-[#C4A747] mb-2" />
                    <CardTitle className="text-[#C4A747]">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-3xl font-bold text-white">{service.price}₺</div>
                      <div className="flex items-center text-zinc-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration} dk
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-[#C4A747] to-[#D4B857] border-none text-black max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-4">Randevunuzu Hemen Alın</h3>
              <p className="mb-6 opacity-90">
                Online randevu sistemi ile kolayca yerinizi ayırtın.
              </p>
              <Link href="/book">
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
