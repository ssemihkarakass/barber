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

export default function AdminServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
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

    fetchServices()
  }

  const fetchServices = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('name')

    if (data) setServices(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    const serviceData = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
    }

    if (editingId) {
      // Update
      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', editingId)

      if (error) {
        alert('Hata: ' + error.message)
        return
      }
      alert('Hizmet güncellendi!')
    } else {
      // Insert
      const { error } = await supabase
        .from('services')
        .insert(serviceData)

      if (error) {
        alert('Hata: ' + error.message)
        return
      }
      alert('Hizmet eklendi!')
    }

    setShowForm(false)
    setEditingId(null)
    resetForm()
    fetchServices()
  }

  const handleEdit = (service: any) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category || '',
      is_active: service.is_active,
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Hata: ' + error.message)
      return
    }

    alert('Hizmet silindi!')
    fetchServices()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Hizmet Yönetimi</h1>
          <Button onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }} className="hidden sm:flex">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Hizmet Ekle
          </Button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <Card className="mb-8 border-[#C4A747]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingId ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditingId(null); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Hizmet Adı</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Saç Kesimi"
                    required
                  />
                </div>

                <div>
                  <Label>Açıklama</Label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Hizmet açıklaması..."
                    className="w-full h-24 rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fiyat (₺)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="150"
                      required
                    />
                  </div>
                  <div>
                    <Label>Süre (dakika)</Label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Kategori</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Örn: Saç, Sakal, Kombo"
                  />
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

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{service.name}</span>
                  <span className={`text-sm ${service.is_active ? 'text-green-500' : 'text-red-500'}`}>
                    {service.is_active ? '✅' : '❌'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 text-sm mb-4">{service.description}</p>
                <div className="flex justify-between mb-4">
                  <span className="text-[#C4A747] font-bold text-xl">{service.price}₺</span>
                  <span className="text-zinc-400">{service.duration} dk</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(service)} className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}>
                    <Trash className="w-4 h-4" />
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
