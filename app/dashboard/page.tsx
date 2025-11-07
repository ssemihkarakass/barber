'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    setUser(user)
    setLoading(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-4 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Hoş Geldiniz</h1>
            <p className="text-sm md:text-base text-zinc-400">{user?.email}</p>
          </div>
          <div className="flex gap-2 md:gap-3 w-full md:w-auto">
            <Link href="/dashboard/settings" className="flex-1 md:flex-none">
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Ayarlar</span>
                <span className="sm:hidden">Ayar</span>
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="flex-1 md:flex-none">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Çıkış Yap</span>
              <span className="sm:hidden">Çıkış</span>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Link href="/book">
            <Card className="hover:scale-105 transition-transform cursor-pointer">
              <CardHeader>
                <Calendar className="w-12 h-12 text-[#C4A747] mb-4" />
                <CardTitle>Yeni Randevu Al</CardTitle>
                <CardDescription>Müsait saatleri görüntüleyin ve randevu alın</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/appointments">
            <Card className="hover:scale-105 transition-transform cursor-pointer">
              <CardHeader>
                <Clock className="w-12 h-12 text-[#C4A747] mb-4" />
                <CardTitle>Randevularım</CardTitle>
                <CardDescription>Geçmiş ve gelecek randevularınızı görün</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/profile">
            <Card className="hover:scale-105 transition-transform cursor-pointer">
              <CardHeader>
                <User className="w-12 h-12 text-[#C4A747] mb-4" />
                <CardTitle>Profilim</CardTitle>
                <CardDescription>Profil bilgilerinizi düzenleyin</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/settings">
            <Card className="hover:scale-105 transition-transform cursor-pointer">
              <CardHeader>
                <Settings className="w-12 h-12 text-[#C4A747] mb-4" />
                <CardTitle>Ayarlar</CardTitle>
                <CardDescription>Hesap ve güvenlik ayarları</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Yaklaşan Randevular</CardTitle>
            <CardDescription>Önümüzdeki randevularınız</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-zinc-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Henüz randevunuz bulunmuyor</p>
              <Link href="/calendar">
                <Button className="mt-4">
                  Randevu Al
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gradient-to-br from-[#C4A747]/10 to-transparent border-[#C4A747]/20">
            <CardHeader>
              <CardTitle className="text-[#C4A747]">Hızlı İpucu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300">
                Randevunuzu en az 24 saat önceden iptal ederseniz, başka bir müşteriye yer açmış olursunuz. 
                Teşekkür ederiz!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#B22222]/10 to-transparent border-[#B22222]/20">
            <CardHeader>
              <CardTitle className="text-[#B22222]">Önemli Bilgi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300">
                Randevunuza 10 dakika geç kalırsanız, randevunuz iptal edilebilir. 
                Lütfen zamanında gelin.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
