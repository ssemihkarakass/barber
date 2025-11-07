'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CheckCircle, XCircle, User, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function EmployeeDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [employee, setEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    completed: 0,
  })

  useEffect(() => {
    checkEmployeeAccess()
  }, [])

  const checkEmployeeAccess = async () => {
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      router.push('/auth/login')
      return
    }

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (!userData || (userData.role !== 'employee' && userData.role !== 'admin')) {
      alert('Bu sayfaya erişim yetkiniz yok!')
      router.push('/dashboard')
      return
    }

    setUser(userData)

    // Get employee data
    const { data: employeeData } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', authUser.id)
      .single()

    if (employeeData) {
      setEmployee(employeeData)
      fetchAppointments(employeeData.id)
      fetchStats(employeeData.id)
    }

    setLoading(false)
  }

  const fetchAppointments = async (employeeId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        services(name, price),
        users!appointments_customer_id_fkey(name, email, phone)
      `)
      .eq('employee_id', employeeId)
      .gte('date', format(new Date(), 'yyyy-MM-dd'))
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (data) setAppointments(data)
  }

  const fetchStats = async (employeeId: string) => {
    const supabase = createClient()
    const today = format(new Date(), 'yyyy-MM-dd')

    const { count: todayCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('employee_id', employeeId)
      .eq('date', today)

    const { count: pendingCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('employee_id', employeeId)
      .eq('status', 'pending')

    const { count: completedCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('employee_id', employeeId)
      .eq('status', 'completed')

    setStats({
      today: todayCount || 0,
      pending: pendingCount || 0,
      completed: completedCount || 0,
    })
  }

  const handleStatusChange = async (id: string, status: string) => {
    const supabase = createClient()
    
    // Fetch appointment details for email notification
    const { data: appointment } = await supabase
      .from('appointments')
      .select(`
        *,
        services(name),
        users!appointments_customer_id_fkey(name, email),
        employees(users(name, email))
      `)
      .eq('id', id)
      .single()
    
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
    
    if (error) {
      console.error('Update error:', error)
      alert('Hata: ' + error.message)
      return
    }
    
    // Send web push notification
    if ('Notification' in window && Notification.permission === 'granted') {
      let notificationTitle = ''
      let notificationBody = `${appointment?.users.name} - ${appointment?.start_time}`
      
      if (status === 'confirmed') {
        notificationTitle = '✅ Randevu Onaylandı!'
      } else if (status === 'cancelled') {
        notificationTitle = '❌ Randevu İptal Edildi'
      } else if (status === 'completed') {
        notificationTitle = '✔️ Randevu Tamamlandı'
      }
      
      if (notificationTitle) {
        new Notification(notificationTitle, {
          body: notificationBody,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: `appointment-${status}`
        })
        
        // Vibrate
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200])
        }
      }
    }
    
    // Send confirmation email to customer if confirmed
    if (status === 'confirmed' && appointment) {
      try {
        await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'appointment_confirmed',
            customerEmail: appointment.users.email,
            customerName: appointment.users.name,
            employeeName: appointment.employees.users.name,
            date: format(new Date(appointment.date), 'd MMMM yyyy', { locale: tr }),
            time: appointment.start_time,
            service: appointment.services.name,
          })
        })
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
      }
    }
    
    if (employee) {
      fetchAppointments(employee.id)
      fetchStats(employee.id)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Bekliyor' },
      confirmed: { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Onaylandı' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-500', label: 'İptal' },
      completed: { bg: 'bg-blue-500/20', text: 'text-blue-500', label: 'Tamamlandı' },
    }
    
    const badge = badges[status as keyof typeof badges] || badges.pending
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
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
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Çalışan Paneli</h1>
          <p className="text-sm md:text-base text-zinc-400">Hoş geldin, {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-blue-500/20 to-transparent border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Bugünkü Randevular</p>
                  <p className="text-3xl font-bold text-white">{stats.today}</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-transparent border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Onay Bekleyen</p>
                  <p className="text-3xl font-bold text-white">{stats.pending}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-transparent border-green-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Tamamlanan</p>
                  <p className="text-3xl font-bold text-white">{stats.completed}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Randevularım</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {appointments.length === 0 ? (
                <p className="text-center text-zinc-400 py-8">Henüz randevu yok</p>
              ) : (
                appointments.map((apt) => (
                  <div key={apt.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 bg-zinc-900 rounded-lg gap-3">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#C4A747] flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 md:w-6 md:h-6 text-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm md:text-base truncate">{apt.users?.name}</p>
                        <p className="text-zinc-400 text-xs md:text-sm mb-1">{apt.services?.name}</p>
                        <p className="text-zinc-500 text-xs md:text-sm">
                          {format(new Date(apt.date), 'd MMM yyyy', { locale: tr })} - {apt.start_time}
                        </p>
                        {apt.users?.phone && (
                          <a href={`tel:${apt.users.phone}`} className="text-[#C4A747] text-xs md:text-sm flex items-center gap-1 mt-1 hover:underline">
                            <Phone className="w-3 h-3" />
                            {apt.users.phone}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3 flex-wrap">
                      <span className="text-[#C4A747] font-bold text-sm md:text-base">{apt.services?.price}₺</span>
                      {getStatusBadge(apt.status)}
                      {apt.status === 'confirmed' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusChange(apt.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm"
                        >
                          Tamamla
                        </Button>
                      )}
                      {apt.status === 'pending' && (
                        <div className="flex gap-2 w-full md:w-auto">
                          <Button 
                            size="sm"
                            onClick={() => handleStatusChange(apt.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none text-xs md:text-sm"
                          >
                            Onayla
                          </Button>
                          <Button 
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(apt.id, 'cancelled')}
                            className="flex-1 md:flex-none text-xs md:text-sm"
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
