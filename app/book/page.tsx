'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Clock, User, Scissors, ChevronLeft, ChevronRight, ArrowLeft, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'
import { sendNotification } from '@/lib/notifications'
import Link from 'next/link'

export default function BookAppointmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Form data
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  
  // Data from database
  const [services, setServices] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  
  // Week navigation
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))

  useEffect(() => {
    checkUserAndRedirect()
  }, [])

  const checkUserAndRedirect = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Randevu almak için giriş yapmanız gerekiyor!')
      router.push('/auth/login')
      return
    }
    
    setUser(user)
    fetchServices()
  }

  useEffect(() => {
    if (selectedEmployee && selectedDate) {
      fetchAppointments()
    }
  }, [selectedEmployee, selectedDate])


  const fetchServices = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
    
    if (data) {
      // Özel sıralama: SAÇ, SAÇ+SAKAL+YIKAMA+FÖN, Premium paket önce
      const priorityOrder = ['SAÇ', 'SAÇ+SAKAL+YIKAMA+FÖN', 'SAÇ+SAKAL+YIKAMA+FÖN+YÜZ BAKIM+SAÇ BAKIM']
      
      const sorted = data.sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.name)
        const bIndex = priorityOrder.indexOf(b.name)
        
        // Her ikisi de priority listesinde
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
        // Sadece a priority listesinde
        if (aIndex !== -1) return -1
        // Sadece b priority listesinde
        if (bIndex !== -1) return 1
        // İkisi de değilse fiyata göre
        return (b.price || 0) - (a.price || 0)
      })
      
      setServices(sorted)
    }
  }

  const fetchEmployees = async (serviceId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('employees')
      .select('*, users(name)')
      .eq('is_active', true)
    
    console.log('Employees data:', data) // Debug
    console.log('Employees error:', error) // Debug
    
    if (error) {
      console.error('Error fetching employees:', error)
      alert('Çalışanlar yüklenemedi! Lütfen Supabase RLS politikalarını kontrol edin.')
    }
    
    if (data) setEmployees(data)
  }

  const fetchAppointments = async () => {
    const supabase = createClient()
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('employee_id', selectedEmployee.id)
      .eq('date', dateStr)
      .in('status', ['pending', 'confirmed', 'completed']) // Tamamlananları da kontrol et
    
    if (data) setAppointments(data)
  }

  const generateTimeSlots = () => {
    const slots = []
    
    // 1 saat aralıklarla slot oluştur (09:00 - 19:00)
    for (let hour = 9; hour < 20; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`
      slots.push(timeStr)
    }
    
    return slots
  }

  const isTimeSlotAvailable = (time: string) => {
    // Bugünse ve saat geçmişse müsait değil
    const now = new Date()
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
    const todayStr = format(now, 'yyyy-MM-dd')
    
    if (selectedDateStr === todayStr) {
      const currentHour = now.getHours()
      const slotHour = parseInt(time.split(':')[0])
      
      if (slotHour <= currentHour) {
        return false
      }
    }
    
    // Randevu varsa müsait değil (tamamlananlar dahil)
    return !appointments.some(apt => {
      const aptStart = apt.start_time.substring(0, 5)  // "14:00:00" -> "14:00"
      const aptEnd = apt.end_time.substring(0, 5)
      const checkTime = time.substring(0, 5)
      
      return checkTime >= aptStart && checkTime < aptEnd
    })
  }

  const handleServiceSelect = (service: any) => {
    setSelectedService(service)
    fetchEmployees(service.id)
    setStep(2)
    // Scroll to top on mobile
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleEmployeeSelect = (employee: any) => {
    setSelectedEmployee(employee)
    setStep(3)
    // Scroll to top on mobile
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime('')
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleBookAppointment = async () => {
    if (!selectedService || !selectedEmployee || !selectedDate || !selectedTime) {
      alert('Lütfen tüm bilgileri doldurun')
      return
    }

    setLoading(true)
    
    try {
      const supabase = createClient()
      
      // Calculate end time
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const duration = selectedService.duration
      const endMinutes = minutes + duration
      const endHours = hours + Math.floor(endMinutes / 60)
      const endTime = `${endHours.toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          customer_id: user.id,
          employee_id: selectedEmployee.id,
          service_id: selectedService.id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: selectedTime,
          end_time: endTime,
          status: 'pending'
        })
        .select()
      
      if (error) throw error
      
      // Send web push notification
      sendNotification('🎉 Randevu Oluşturuldu!', {
        body: `${selectedService.name} - ${format(selectedDate, 'd MMMM', { locale: tr })} ${selectedTime}`,
        tag: 'appointment-created'
      })
      
      // Send notification to employee
      try {
        await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'new_appointment',
            employeeEmail: selectedEmployee.users.email,
            employeeName: selectedEmployee.users.name,
            customerName: user.user_metadata.name || user.email,
            date: format(selectedDate, 'd MMMM yyyy', { locale: tr }),
            time: selectedTime,
            service: selectedService.name,
          })
        })
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
        // Don't block the booking if email fails
      }
      
      alert('Randevunuz başarıyla oluşturuldu! Onay bekliyor.')
      router.push('/dashboard/appointments')
    } catch (error: any) {
      alert('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  return (
    <div className="min-h-screen py-4 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Mobile Header with Back Button */}
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <Link href="/calendar">
            <Button variant="ghost" size="sm" className="text-xs md:text-sm">
              <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Takvime Dön</span>
              <span className="sm:hidden">Geri</span>
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-white">Randevu Al</h1>
            <p className="text-zinc-400 text-xs md:text-sm hidden sm:block">Adım adım randevunuzu oluşturun</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6 md:mb-8 gap-1 md:gap-4 overflow-x-auto pb-2">
          {[
            { num: 1, label: 'Hizmet' },
            { num: 2, label: 'Berber' },
            { num: 3, label: 'Tarih & Saat' },
            { num: 4, label: 'Onay' }
          ].map((s) => (
            <div key={s.num} className="flex items-center flex-shrink-0">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${
                step >= s.num ? 'bg-[#C4A747] text-black' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {s.num}
              </div>
              <span className={`ml-1 sm:ml-2 text-xs sm:text-base whitespace-nowrap ${step >= s.num ? 'text-white' : 'text-zinc-500'}`}>
                {s.label}
              </span>
              {s.num < 4 && <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 mx-1 sm:mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Hizmet Seçin</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card 
                  key={service.id}
                  className="cursor-pointer hover:scale-105 transition-all border-2 hover:border-[#C4A747]"
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scissors className="w-5 h-5 text-[#C4A747] flex-shrink-0" />
                      <span className="truncate">{service.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#C4A747]">{service.price}₺</span>
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration} dk
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Employee */}
        {step === 2 && (
          <div>
            <Button variant="ghost" onClick={() => setStep(1)} className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
            <h2 className="text-2xl font-bold text-white mb-6">Berber Seçin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map((employee) => (
                <Card 
                  key={employee.id}
                  className="cursor-pointer hover:scale-105 transition-all border-2 hover:border-[#C4A747]"
                  onClick={() => handleEmployeeSelect(employee)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C4A747] to-[#D4B857] flex items-center justify-center">
                        <User className="w-8 h-8 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{employee.users?.name}</h3>
                        <p className="text-[#C4A747] text-sm">{employee.specialization}</p>
                        <p className="text-zinc-400 text-sm mt-1">
                          {employee.start_hour} - {employee.end_hour}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Date & Time */}
        {step === 3 && (
          <div>
            <Button variant="ghost" onClick={() => setStep(2)} className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
            <h2 className="text-2xl font-bold text-white mb-6">Tarih ve Saat Seçin</h2>
            
            {/* Week Navigator */}
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-white font-semibold">
                {format(currentWeekStart, 'd MMMM', { locale: tr })} - {format(addDays(currentWeekStart, 6), 'd MMMM yyyy', { locale: tr })}
              </span>
              <Button 
                variant="outline"
                onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {weekDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate)
                const isToday = isSameDay(day, new Date())
                
                return (
                  <button
                    key={day.toString()}
                    onClick={() => handleDateSelect(day)}
                    className={`p-4 rounded-lg text-center transition-all ${
                      isSelected 
                        ? 'bg-[#C4A747] text-black font-bold' 
                        : isToday
                        ? 'bg-zinc-800 text-white border-2 border-[#C4A747]'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    }`}
                  >
                    <div className="text-xs opacity-70">{format(day, 'EEE', { locale: tr })}</div>
                    <div className="text-2xl font-bold">{format(day, 'd')}</div>
                    <div className="text-xs opacity-70">{format(day, 'MMM', { locale: tr })}</div>
                  </button>
                )
              })}
            </div>

            {/* Time Slots */}
            <h3 className="text-xl font-bold text-white mb-4">Müsait Saatler</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {generateTimeSlots().filter((time: string) => isTimeSlotAvailable(time)).map((time: string) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedTime === time
                      ? 'bg-[#C4A747] text-black font-bold'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            {selectedTime && (
              <div className="mt-8">
                <Button size="lg" onClick={() => setStep(4)} className="w-full">
                  Devam Et
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div>
            <Button variant="ghost" onClick={() => setStep(3)} className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
            <h2 className="text-2xl font-bold text-white mb-6">Randevu Özeti</h2>
            
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-lg">
                  <Scissors className="w-8 h-8 text-[#C4A747]" />
                  <div>
                    <p className="text-sm text-zinc-400">Hizmet</p>
                    <p className="text-xl font-bold text-white">{selectedService?.name}</p>
                    <p className="text-[#C4A747]">{selectedService?.price}₺ - {selectedService?.duration} dakika</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-lg">
                  <User className="w-8 h-8 text-[#C4A747]" />
                  <div>
                    <p className="text-sm text-zinc-400">Berber</p>
                    <p className="text-xl font-bold text-white">{selectedEmployee?.users?.name}</p>
                    <p className="text-zinc-400">{selectedEmployee?.specialization}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-lg">
                  <CalendarIcon className="w-8 h-8 text-[#C4A747]" />
                  <div>
                    <p className="text-sm text-zinc-400">Tarih ve Saat</p>
                    <p className="text-xl font-bold text-white">
                      {format(selectedDate, 'd MMMM yyyy', { locale: tr })}
                    </p>
                    <p className="text-[#C4A747]">{selectedTime}</p>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  onClick={handleBookAppointment} 
                  disabled={loading}
                  className="w-full mt-6"
                >
                  {loading ? 'Randevu Oluşturuluyor...' : 'Randevuyu Onayla'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
