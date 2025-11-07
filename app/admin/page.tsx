'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Scissors, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  })
  const [recentAppointments, setRecentAppointments] = useState<any[]>([])

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      router.push('/auth/login')
      return
    }

    // Get fresh user data
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    console.log('Admin check - User data:', userData) // Debug
    console.log('Admin check - Role:', userData?.role) // Debug

    if (error) {
      console.error('Error fetching user:', error)
      alert('Kullanıcı bilgileri alınamadı!')
      router.push('/dashboard')
      return
    }

    if (!userData) {
      alert('Kullanıcı bulunamadı!')
      router.push('/dashboard')
      return
    }

    if (userData.role !== 'admin') {
      alert(`Bu sayfaya erişim yetkiniz yok! Rolünüz: ${userData.role}`)
      router.push('/dashboard')
      return
    }

    setUser(userData)
    fetchStats()
    fetchRecentAppointments()
    setLoading(false)
  }

  const fetchStats = async () => {
    const supabase = createClient()
    const today = format(new Date(), 'yyyy-MM-dd')

    // Total appointments
    const { count: totalCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })

    // Pending appointments
    const { count: pendingCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Today's appointments
    const { count: todayCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('date', today)

    // Total customers
    const { count: customersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer')

    // Total revenue (confirmed appointments)
    const { data: confirmedAppointments } = await supabase
      .from('appointments')
      .select('services(price)')
      .eq('status', 'confirmed')

    const revenue = confirmedAppointments?.reduce((sum, apt) => {
      const service = apt.services as any
      return sum + (service?.price || 0)
    }, 0) || 0

    setStats({
      totalAppointments: totalCount || 0,
      pendingAppointments: pendingCount || 0,
      todayAppointments: todayCount || 0,
      totalCustomers: customersCount || 0,
      totalRevenue: revenue,
    })
  }

  const fetchRecentAppointments = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        users!appointments_customer_id_fkey(name, email),
        services(name, price),
        employees(users(name))
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) setRecentAppointments(data)
  }

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointmentId)

    if (!error) {
      alert('Randevu durumu güncellendi!')
      fetchStats()
      fetchRecentAppointments()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Bekliyor', icon: Clock },
      confirmed: { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Onaylandı', icon: CheckCircle },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-500', label: 'İptal', icon: XCircle },
      completed: { bg: 'bg-blue-500/20', text: 'text-blue-500', label: 'Tamamlandı', icon: CheckCircle },
    }
    
    const badge = badges[status as keyof typeof badges] || badges.pending
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C4A747] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-4 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Admin Paneli</h1>
          <p className="text-sm md:text-base text-zinc-400">Hoş geldin, {user?.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-[#C4A747]/20 to-transparent border-[#C4A747]/30">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
                <div className="flex-1">
                  <p className="text-zinc-400 text-xs md:text-sm">Toplam Randevu</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">{stats.totalAppointments}</p>
                </div>
                <Calendar className="w-8 h-8 md:w-12 md:h-12 text-[#C4A747]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-transparent border-yellow-500/30">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
                <div className="flex-1">
                  <p className="text-zinc-400 text-xs md:text-sm">Onay Bekleyen</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">{stats.pendingAppointments}</p>
                </div>
                <AlertCircle className="w-8 h-8 md:w-12 md:h-12 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-transparent border-blue-500/30">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
                <div className="flex-1">
                  <p className="text-zinc-400 text-xs md:text-sm">Bugünkü</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">{stats.todayAppointments}</p>
                </div>
                <Clock className="w-8 h-8 md:w-12 md:h-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-transparent border-green-500/30">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
                <div className="flex-1">
                  <p className="text-zinc-400 text-xs md:text-sm">Müşteri</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">{stats.totalCustomers}</p>
                </div>
                <Users className="w-8 h-8 md:w-12 md:h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#B22222]/20 to-transparent border-[#B22222]/30 col-span-2 lg:col-span-1">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2">
                <div className="flex-1">
                  <p className="text-zinc-400 text-xs md:text-sm">Toplam Gelir</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">{stats.totalRevenue}₺</p>
                </div>
                <TrendingUp className="w-8 h-8 md:w-12 md:h-12 text-[#B22222]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Link href="/admin/appointments">
            <Card className="hover:scale-105 transition-all cursor-pointer">
              <CardHeader>
                <Calendar className="w-12 h-12 text-[#C4A747] mb-2" />
                <CardTitle>Randevu Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">Tüm randevuları görüntüle ve yönet</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/services">
            <Card className="hover:scale-105 transition-all cursor-pointer">
              <CardHeader>
                <Scissors className="w-12 h-12 text-[#C4A747] mb-2" />
                <CardTitle>Hizmet Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">Hizmetleri ekle, düzenle ve sil</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/employees">
            <Card className="hover:scale-105 transition-all cursor-pointer">
              <CardHeader>
                <Users className="w-12 h-12 text-[#C4A747] mb-2" />
                <CardTitle>Çalışan Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">Çalışanları yönet ve programla</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Son Randevular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.length === 0 ? (
                <p className="text-center text-zinc-400 py-8">Henüz randevu yok</p>
              ) : (
                recentAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                    <div className="flex-1">
                      <p className="text-white font-semibold">{apt.users?.name}</p>
                      <p className="text-zinc-400 text-sm">{apt.services?.name} - {apt.employees?.users?.name}</p>
                      <p className="text-zinc-500 text-xs">
                        {format(new Date(apt.date), 'd MMMM yyyy', { locale: tr })} - {apt.start_time}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#C4A747] font-bold">{apt.services?.price}₺</span>
                      {getStatusBadge(apt.status)}
                      {apt.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusChange(apt.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Onayla
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleStatusChange(apt.id, 'cancelled')}
                          >
                            İptal
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
