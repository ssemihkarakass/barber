'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import trLocale from '@fullcalendar/core/locales/tr'
import { Card } from '@/components/ui/card'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
  textColor?: string
}

export function CalendarView() {
  const [events] = useState<CalendarEvent[]>([
    // Örnek randevular
    {
      id: '1',
      title: 'Ahmet Yılmaz - Saç Kesimi',
      start: '2024-11-08T10:00:00',
      end: '2024-11-08T10:30:00',
      backgroundColor: '#B22222',
      borderColor: '#B22222',
      textColor: '#ffffff',
    },
    {
      id: '2',
      title: 'Mehmet Demir - Sakal Düzeltme',
      start: '2024-11-08T11:00:00',
      end: '2024-11-08T11:20:00',
      backgroundColor: '#B22222',
      borderColor: '#B22222',
      textColor: '#ffffff',
    },
    {
      id: '3',
      title: 'Can Öztürk - Kombo',
      start: '2024-11-08T14:00:00',
      end: '2024-11-08T14:45:00',
      backgroundColor: '#B22222',
      borderColor: '#B22222',
      textColor: '#ffffff',
    },
  ])

  const handleDateClick = (arg: any) => {
    alert(`Seçilen tarih: ${arg.dateStr}`)
  }

  const handleEventClick = (arg: any) => {
    alert(`Randevu: ${arg.event.title}`)
  }

  return (
    <Card className="p-6">
      <style jsx global>{`
        .fc {
          --fc-border-color: #27272a;
          --fc-button-bg-color: #D4AF37;
          --fc-button-border-color: #D4AF37;
          --fc-button-hover-bg-color: #F4D03F;
          --fc-button-hover-border-color: #F4D03F;
          --fc-button-active-bg-color: #B8941F;
          --fc-button-active-border-color: #B8941F;
          --fc-today-bg-color: rgba(212, 175, 55, 0.1);
        }
        
        .fc .fc-button {
          text-transform: capitalize;
          font-weight: 600;
        }
        
        .fc .fc-button-primary:not(:disabled):active,
        .fc .fc-button-primary:not(:disabled).fc-button-active {
          background-color: #B8941F;
          border-color: #B8941F;
        }
        
        .fc .fc-toolbar-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .fc .fc-col-header-cell {
          background-color: #18181b;
          color: #D4AF37;
          font-weight: 600;
          padding: 12px 0;
        }
        
        .fc .fc-daygrid-day {
          background-color: #09090b;
        }
        
        .fc .fc-daygrid-day:hover {
          background-color: #18181b;
        }
        
        .fc .fc-daygrid-day-number {
          color: white;
          padding: 8px;
        }
        
        .fc .fc-timegrid-slot {
          height: 3rem;
        }
        
        .fc .fc-timegrid-slot-label {
          color: #a1a1aa;
        }
        
        .fc .fc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .fc .fc-event:hover {
          opacity: 0.9;
        }
        
        .fc .fc-day-today {
          background-color: rgba(212, 175, 55, 0.05) !important;
        }
        
        .fc .fc-scrollgrid {
          border-color: #27272a;
        }
        
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: #27272a;
        }
      `}</style>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={trLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        slotMinTime="09:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        height="auto"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
          startTime: '09:00',
          endTime: '20:00',
        }}
        slotDuration="00:15:00"
        slotLabelInterval="01:00"
        expandRows={true}
        nowIndicator={true}
      />
    </Card>
  )
}
