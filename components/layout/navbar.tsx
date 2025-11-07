'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Scissors, Calendar, Briefcase, Users, Menu, X, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState('customer')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (authUser) {
      // Get user role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser.id)
        .single()
      
      setUserRole(userData?.role || 'customer')
    }
    
    setUser(authUser)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setUserRole('customer')
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { href: '/', label: 'Ana Sayfa', icon: Scissors },
    { href: '/calendar', label: 'Takvim', icon: Calendar },
    { href: '/services', label: 'Hizmetler', icon: Briefcase },
    { href: '/team', label: 'Ekibimiz', icon: Users },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Scissors className="w-8 h-8 text-[#C4A747] group-hover:rotate-12 transition-transform" />
              <div className="absolute inset-0 bg-[#C4A747] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#C4A747] to-[#C4A747] bg-clip-text text-transparent">
              Furkan Emer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                    isActive
                      ? "bg-[#C4A747] text-black font-semibold"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link href={userRole === 'admin' ? '/admin' : userRole === 'employee' ? '/employee' : '/dashboard'}>
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {userRole === 'admin' ? 'Admin Panel' : userRole === 'employee' ? 'Çalışan Panel' : 'Panelim'}
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Çıkış
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button>
                    Kayıt Ol
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                      isActive
                        ? "bg-[#C4A747] text-black font-semibold"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <Link href={userRole === 'admin' ? '/admin' : userRole === 'employee' ? '/employee' : '/dashboard'} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <User className="w-4 h-4 mr-2" />
                        {userRole === 'admin' ? 'Admin Panel' : userRole === 'employee' ? 'Çalışan Panel' : 'Panelim'}
                      </Button>
                    </Link>
                    <Button variant="destructive" className="w-full" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Giriş Yap
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">
                        Kayıt Ol
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
