'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash, X } from 'lucide-react'

export default function AdminEmployeesPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    user_id: '',
    specialization: '',
    start_hour: '09:00',
    end_hour: '18:00',
    is_active: true,
  })

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

    fetchEmployees()
    fetchUsers()
  }

  const fetchEmployees = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('employees')
      .select('*, users(name, email)')
      .order('created_at')

    if (data) setEmployees(data)
    setLoading(false)
  }

  const fetchUsers = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('users')
      .select('id, name, email, role')
      .in('role', ['employee', 'admin'])

    if (data) setUsers(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    if (editingId) {
      // Update
      const { error } = await supabase
        .from('employees')
        .update(formData)
        .eq('id', editingId)

      if (error) {
        alert('Hata: ' + error.message)
        return
      }
      alert('Çalışan güncellendi!')
    } else {
      // Insert
      const { error } = await supabase
        .from('employees')
        .insert(formData)

      if (error) {
        alert('Hata: ' + error.message)
        return
      }
      alert('Çalışan eklendi!')
    }

    setShowForm(false)
    setEditingId(null)
    resetForm()
    fetchEmployees()
  }

  const handleEdit = (emp: any) => {
    setFormData({
      user_id: emp.user_id,
      specialization: emp.specialization,
      start_hour: emp.start_hour,
      end_hour: emp.end_hour,
      is_active: emp.is_active,
    })
    setEditingId(emp.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu çalışanı silmek istediğinizden emin misiniz?')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Hata: ' + error.message)
      return
    }

    alert('Çalışan silindi!')
    fetchEmployees()
  }

  const resetForm = () => {
    setFormData({
      user_id: '',
      specialization: '',
      start_hour: '09:00',
      end_hour: '18:00',
      is_active: true,
    })
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
          <Button size="sm" onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }} className="sm:hidden">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Çalışan Yönetimi</h1>
          <Button onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }} className="hidden sm:flex">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Çalışan Ekle
          </Button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <Card className="mb-8 border-[#C4A747]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingId ? 'Çalışan Düzenle' : 'Yeni Çalışan Ekle'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditingId(null); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Kullanıcı Seç</Label>
                  <select
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    className="w-full h-11 rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 text-white"
                    required
                    disabled={!!editingId}
                  >
                    <option value="">Seçiniz...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email}) - {user.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Uzmanlık</Label>
                  <Input
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Örn: Saç Kesimi & Sakal Uzmanı"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Başlangıç Saati</Label>
                    <Input
                      type="time"
                      value={formData.start_hour}
                      onChange={(e) => setFormData({ ...formData, start_hour: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Bitiş Saati</Label>
                    <Input
                      type="time"
                      value={formData.end_hour}
                      onChange={(e) => setFormData({ ...formData, end_hour: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_active">Aktif</Label>
                </div>

                <Button type="submit" className="w-full">
                  {editingId ? 'Güncelle' : 'Ekle'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Employees List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map((emp) => (
            <Card key={emp.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{emp.users?.name}</span>
                  <span className={`text-sm ${emp.is_active ? 'text-green-500' : 'text-red-500'}`}>
                    {emp.is_active ? '✅ Aktif' : '❌ Pasif'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 mb-2">{emp.specialization}</p>
                <p className="text-zinc-500 text-sm mb-4">
                  Çalışma Saatleri: {emp.start_hour} - {emp.end_hour}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(emp)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(emp.id)}>
                    <Trash className="w-4 h-4 mr-2" />
                    Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
