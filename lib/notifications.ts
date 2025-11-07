// Web Push Notification Helper Functions

export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied'
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied'
  return await Notification.requestPermission()
}

export function sendNotification(title: string, options?: NotificationOptions) {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported')
    return
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted')
    return
  }

  // Vibrate if supported
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200])
  }

  // If service worker is available, use it
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      })
    })
  } else {
    // Fallback to regular notification
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    })
  }
}

// Notification templates
export const NotificationTemplates = {
  newAppointment: (customerName: string, time: string) => ({
    title: '🔔 Yeni Randevu!',
    options: {
      body: `${customerName} - ${time}`,
      tag: 'new-appointment',
      requireInteraction: true,
      actions: [
        { action: 'view', title: 'Görüntüle' },
        { action: 'close', title: 'Kapat' }
      ],
      data: {
        url: '/employee'
      }
    }
  }),

  appointmentConfirmed: (employeeName: string, time: string) => ({
    title: '✅ Randevunuz Onaylandı!',
    options: {
      body: `${employeeName} - ${time}`,
      tag: 'appointment-confirmed',
      requireInteraction: true,
      actions: [
        { action: 'view', title: 'Görüntüle' },
        { action: 'close', title: 'Kapat' }
      ],
      data: {
        url: '/dashboard/appointments'
      }
    }
  }),

  appointmentReminder: (time: string) => ({
    title: '⏰ Randevu Hatırlatması',
    options: {
      body: `Randevunuz ${time} sonra başlıyor!`,
      tag: 'appointment-reminder',
      requireInteraction: true,
      data: {
        url: '/dashboard/appointments'
      }
    }
  }),

  appointmentCancelled: () => ({
    title: '❌ Randevu İptal Edildi',
    options: {
      body: 'Randevunuz iptal edildi.',
      tag: 'appointment-cancelled',
      data: {
        url: '/dashboard/appointments'
      }
    }
  })
}
