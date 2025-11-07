'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, BellOff } from 'lucide-react'

export function NotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [showPrompt, setShowPrompt] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)
      
      // Show prompt after 5 seconds if not granted
      if (Notification.permission === 'default') {
        setTimeout(() => setShowPrompt(true), 5000)
      }
    }
  }, [])

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      setShowPrompt(false)
      
      if (result === 'granted') {
        // Test notification
        const notification = new Notification('Bildirimler Açıldı! 🎉', {
          body: 'Artık randevu bildirimleri alacaksınız.',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'welcome'
        })
        
        // Vibrate if supported
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200])
        }
      }
    }
  }

  if (!isClient) {
    return null
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null
  }

  if (permission === 'granted') {
    return null
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <div className="bg-zinc-900 border border-[#C4A747] rounded-lg shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C4A747] flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">Bildirimleri Aç</h3>
            <p className="text-zinc-400 text-sm mb-3">
              Randevu onayları ve güncellemeler için bildirim almak ister misiniz?
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={requestPermission}
                className="flex-1"
              >
                <Bell className="w-4 h-4 mr-2" />
                Aç
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowPrompt(false)}
              >
                <BellOff className="w-4 h-4 mr-2" />
                Şimdi Değil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
