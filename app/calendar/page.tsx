'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format, addDays, startOfWeek } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [employees, setEmployees] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments()
    }
  }, [selectedDate])

  const fetchEmployees = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('employees')
      .select('*, users(name)')
      .eq('is_active', true)
      .order('created_at')
    
    if (data) setEmployees(data)
    setLoading(false)
  }

  const fetchAppointments = async () => {
    const supabase = createClient()
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    
    const { data } = await supabase
      .from('appointments')
      .select('*, services(name), users!appointments_customer_id_fkey(name)')
      .eq('date', dateStr)
      .in('status', ['pending', 'confirmed', 'completed']) // Tamamlananları da göster
    
    if (data) setAppointments(data)
  }

  const generateTimeSlots = () => {
    const slots = []
    // 1 saat aralıklarla (09:00 - 23:00)
    for (let hour = 9; hour < 24; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    return slots
  }

  const isSlotBooked = (employeeId: string, time: string) => {
    return appointments.some(apt => {
      if (apt.employee_id !== employeeId) return false
      
      // Saat karşılaştırması için sadece saat kısmını al
      const aptStart = apt.start_time.substring(0, 5) // "14:00:00" -> "14:00"
      const aptEnd = apt.end_time.substring(0, 5)
      const checkTime = time.substring(0, 5)
      
      // Randevu saati ile kontrol edilen saat aynı mı veya aralıkta mı?
      return checkTime >= aptStart && checkTime < aptEnd
    })
  }

  const getAppointmentAtSlot = (employeeId: string, time: string) => {
    return appointments.find(apt => {
      if (apt.employee_id !== employeeId) return false
      
      const aptStart = apt.start_time.substring(0, 5)
      const aptEnd = apt.end_time.substring(0, 5)
      const checkTime = time.substring(0, 5)
      
      return checkTime >= aptStart && checkTime < aptEnd
    })
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))
  const timeSlots = generateTimeSlots()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#C4A747] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-4 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">Randevu Takvimi</h1>
          <p className="text-sm md:text-base text-zinc-400 mb-4 md:mb-6">
            Gün seçin ve berberlerin müsaitlik durumunu görün
          </p>
          <Link href="/book">
            <Button size="lg" className="text-sm md:text-base">
              <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Randevu Al
            </Button>
          </Link>
        </div>

        {/* Week Selector */}
        <div className="flex items-center justify-between mb-4 md:mb-6 gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
            className="text-xs md:text-sm"
          >
            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
            <span className="hidden md:inline">Önceki Hafta</span>
          </Button>
          <h2 className="text-sm md:text-xl font-bold text-white text-center">
            {format(currentWeekStart, 'd MMM', { locale: tr })} - {format(addDays(currentWeekStart, 6), 'd MMM yyyy', { locale: tr })}
          </h2>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
            className="text-xs md:text-sm"
          >
            <span className="hidden md:inline">Sonraki Hafta</span>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 md:ml-2" />
          </Button>
        </div>

        {/* Day Selector */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-6 md:mb-8">
          {weekDays.map((day) => {
            const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
            
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`p-2 md:p-4 rounded-lg text-center transition-all ${
                  isSelected 
                    ? 'bg-[#C4A747] text-black font-bold scale-105' 
                    : isToday
                    ? 'bg-zinc-800 text-white border-2 border-[#C4A747]'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                <div className="text-[10px] md:text-xs opacity-70">{format(day, 'EEE', { locale: tr })}</div>
                <div className="text-lg md:text-2xl font-bold">{format(day, 'd')}</div>
                <div className="text-[10px] md:text-xs opacity-70 hidden sm:block">{format(day, 'MMM', { locale: tr })}</div>
              </button>
            )
          })}
        </div>

        {/* Selected Date Info */}
        <Card className="mb-4 md:mb-6 bg-gradient-to-r from-[#C4A747]/20 to-transparent border-[#C4A747]/30">
          <CardContent className="pt-4 md:pt-6">
            <h3 className="text-lg md:text-2xl font-bold text-white text-center">
              {format(selectedDate, 'd MMMM yyyy, EEEE', { locale: tr })}
            </h3>
            <p className="text-center text-zinc-400 mt-2 text-xs md:text-base">
              Aşağıda tüm berberlerin saat saat müsaitlik durumunu görebilirsiniz
            </p>
          </CardContent>
        </Card>

        {/* Time Slots Grid */}
        <div className="space-y-4 md:space-y-6">
          {employees.map((employee) => (
            <Card key={employee.id}>
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#C4A747] to-[#D4B857] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base md:text-xl truncate">{employee.users?.name}</div>
                    <div className="text-xs md:text-sm text-zinc-400 font-normal truncate">{employee.specialization}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-1 md:gap-2">
                  {timeSlots.map((time) => {
                    const [hour] = time.split(':')
                    const hourNum = parseInt(hour)
                    
                    // Check if within employee working hours (09:00 - 23:00)
                    const startHour = 9
                    const endHour = 23
                    
                    if (hourNum < startHour || hourNum >= endHour) {
                      return (
                        <div 
                          key={time}
                          className="p-1.5 md:p-2 rounded bg-zinc-800 text-center text-zinc-600 text-[10px] md:text-xs"
                        >
                          <div className="font-bold">{time}</div>
                          <div className="text-[9px] md:text-xs mt-0.5 md:mt-1">Kapalı</div>
                        </div>
                      )
                    }

                    // Bugünse ve geçmiş saatse gösterme
                    const now = new Date()
                    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
                    const todayStr = format(now, 'yyyy-MM-dd')
                    
                    if (selectedDateStr === todayStr && hourNum < now.getHours()) {
                      return null // Geçmiş saatleri gösterme
                    }

                    const isBooked = isSlotBooked(employee.id, time)
                    const appointment = getAppointmentAtSlot(employee.id, time)

                    // Renk ve emoji belirleme
                    let bgColor = 'bg-green-500/20'
                    let textColor = 'text-green-400'
                    let borderColor = 'border-green-500/30'
                    let emoji = '✅'
                    
                    if (isBooked && appointment) {
                      if (appointment.status === 'completed') {
                        bgColor = 'bg-zinc-700/40'
                        textColor = 'text-zinc-400'
                        borderColor = 'border-zinc-600/30'
                        emoji = '✔️'
                      } else if (appointment.status === 'pending') {
                        bgColor = 'bg-yellow-500/20'
                        textColor = 'text-yellow-400'
                        borderColor = 'border-yellow-500/30'
                        emoji = '⏳'
                      } else if (appointment.status === 'confirmed') {
                        bgColor = 'bg-red-500/20'
                        textColor = 'text-red-400'
                        borderColor = 'border-red-500/30'
                        emoji = '❌'
                      }
                    }

                    return (
                      <div 
                        key={time}
                        className={`p-1.5 md:p-2 rounded text-center text-[10px] md:text-xs transition-all ${bgColor} ${textColor} border ${borderColor} ${!isBooked ? 'hover:scale-105' : ''}`}
                      >
                        <div className="font-bold">{time}</div>
                        <div className="text-[9px] md:text-xs mt-0.5 md:mt-1">{emoji}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Açıklama</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <span className="text-green-400">✅</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Müsait</p>
                  <p className="text-zinc-400 text-sm">Randevu alabilirsiniz</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <span className="text-red-400">❌</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Dolu</p>
                  <p className="text-zinc-400 text-sm">Bu saat dolu</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-600">—</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Kapalı</p>
                  <p className="text-zinc-400 text-sm">Çalışma saati dışı</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
