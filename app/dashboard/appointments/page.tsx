'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Scissors, X, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format, parseISO, isPast } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'

export default function AppointmentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
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
    fetchAppointments(user.id)
  }

  const fetchAppointments = async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        services(name, price, duration),
        employees(
          specialization,
          users(name)
        )
      `)
      .eq('customer_id', userId)
      .order('date', { ascending: false })
      .order('start_time', { ascending: false })
    
    if (data) {
      setAppointments(data)
    }
    setLoading(false)
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Randevuyu iptal etmek istediğinizden emin misiniz?')) return
    
    const supabase = createClient()
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)
    
    if (!error) {
      alert('Randevu iptal edildi')
      fetchAppointments(user.id)
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Onay Bekliyor', icon: Clock },
      confirmed: { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Onaylandı', icon: CheckCircle },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-500', label: 'İptal Edildi', icon: XCircle },
    }
    
    const badge = badges[status as keyof typeof badges] || badges.pending
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    )
  }

  const upcomingAppointments = appointments.filter(apt => 
    !isPast(parseISO(`${apt.date}T${apt.start_time}`)) && apt.status !== 'cancelled'
  )
  
  const pastAppointments = appointments.filter(apt => 
    isPast(parseISO(`${apt.date}T${apt.start_time}`)) || apt.status === 'cancelled'
  )

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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Randevularım</h1>
            <p className="text-sm md:text-base text-zinc-400">Tüm randevularınızı buradan yönetin</p>
          </div>
          <Link href="/book">
            <Button size="lg" className="w-full md:w-auto">
              <Calendar className="w-4 h-4 mr-2" />
              Yeni Randevu Al
            </Button>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Yaklaşan Randevular</h2>
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400 mb-4">Yaklaşan randevunuz bulunmuyor</p>
                <Link href="/book">
                  <Button>Randevu Al</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {upcomingAppointments.map((apt) => (
                <Card key={apt.id} className="border-2 border-[#C4A747]/30">
                  <CardHeader className="pb-3 md:pb-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                      <CardTitle className="text-base md:text-lg text-[#C4A747]">{apt.services.name}</CardTitle>
                      {getStatusBadge(apt.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2 md:gap-3 text-white">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#C4A747] flex-shrink-0" />
                      <span className="font-semibold text-sm md:text-base">
                        {format(parseISO(apt.date), 'd MMMM yyyy, EEEE', { locale: tr })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3 text-white">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#C4A747] flex-shrink-0" />
                      <span className="text-sm md:text-base">{apt.start_time} - {apt.end_time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3 text-white">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-[#C4A747] flex-shrink-0" />
                      <span className="text-sm md:text-base">{apt.employees.users.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3 text-white">
                      <Scissors className="w-4 h-4 md:w-5 md:h-5 text-[#C4A747] flex-shrink-0" />
                      <span className="text-sm md:text-base">{apt.services.duration} dakika - {apt.services.price}₺</span>
                    </div>

                    {apt.status === 'pending' && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="w-full mt-4"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Randevuyu İptal Et
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Past Appointments */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Geçmiş Randevular</h2>
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-zinc-400">Geçmiş randevunuz bulunmuyor</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {pastAppointments.map((apt) => (
                <Card key={apt.id} className="opacity-75">
                  <CardContent className="py-3 md:py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-6">
                        <div>
                          <p className="text-white font-semibold text-sm md:text-base">{apt.services.name}</p>
                          <p className="text-zinc-400 text-xs md:text-sm">
                            {format(parseISO(apt.date), 'd MMM yyyy', { locale: tr })} - {apt.start_time}
                          </p>
                        </div>
                        <div className="text-zinc-400 text-xs md:text-sm">
                          {apt.employees.users.name}
                        </div>
                      </div>
                      {getStatusBadge(apt.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
