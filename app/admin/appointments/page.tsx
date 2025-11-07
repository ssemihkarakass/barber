'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AdminAppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAndFetch()
  }, [])

  const checkAdminAndFetch = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    fetchAppointments()
  }

  const fetchAppointments = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        users!appointments_customer_id_fkey(name, email, phone),
        services(name, price),
        employees(users(name))
      `)
      .order('date', { ascending: false })
      .order('start_time', { ascending: false })

    if (data) setAppointments(data)
    setLoading(false)
  }

  const handleStatusChange = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('appointments').update({ status }).eq('id', id)
    fetchAppointments()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#C4A747] border-t-transparent rounded-full animate-spin" />
    </div>
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Admin Paneline Dön</span>
              <span className="sm:hidden">Geri</span>
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Tüm Randevular</h1>

        <div className="space-y-4">
          {appointments.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{apt.users?.name}</p>
                    <p className="text-zinc-400 text-sm">{apt.services?.name} - {apt.employees?.users?.name}</p>
                    <p className="text-zinc-500 text-xs">
                      {format(new Date(apt.date), 'd MMMM yyyy', { locale: tr })} - {apt.start_time}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {apt.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => handleStatusChange(apt.id, 'confirmed')} className="flex-1 sm:flex-none">
                          <span className="hidden sm:inline">Onayla</span>
                          <span className="sm:hidden">✓</span>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleStatusChange(apt.id, 'cancelled')} className="flex-1 sm:flex-none">
                          <span className="hidden sm:inline">İptal</span>
                          <span className="sm:hidden">✗</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
