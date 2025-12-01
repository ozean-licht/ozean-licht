'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { AppLayout } from "@/components/app-layout"
import { SpanDesign } from "@/components/span-design"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Play,
  Sparkles,
  Calendar,
  ArrowRight,
  Globe,
  Shield,
  Receipt,
  FileText,
  LogOut
} from 'lucide-react'
import Link from 'next/link'

interface UserStats {
  totalCourses: number
  completedCourses: number
  totalHours: number
  currentStreak: number
}

interface Course {
  id: string
  title: string
  subtitle?: string
  slug: string
  thumbnail_url_desktop?: string
  purchase_date: string
  last_viewed?: string
}

interface Order {
  id: string
  order_date: string
  status: string
  total_amount?: number
  source: string
  ablefy_order_number?: string
  courses?: {
    title: string
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [recentCourses, setRecentCourses] = useState<Course[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session?.user) {
      // Load user data from API
      loadUserData()
    }
  }, [status, session, router])

  const loadUserData = async () => {
    try {
      // TODO: Fetch from MCP Gateway
      // For now, use mock data
      setStats({
        totalCourses: 3,
        completedCourses: 1,
        totalHours: 12,
        currentStreak: 5
      })

      setRecentCourses([
        {
          id: '1',
          title: 'LCQ Basis Kurs',
          subtitle: 'Grundlagen der Light Code Quantum Transformation',
          slug: 'lcq-basis',
          thumbnail_url_desktop: '/images/course-placeholder.jpg',
          purchase_date: '2025-01-01',
          last_viewed: '2025-01-15'
        }
      ])

      setRecentOrders([
        {
          id: '1',
          order_date: '2025-01-01',
          status: 'paid',
          total_amount: 497,
          source: 'website',
          courses: { title: 'LCQ Basis Kurs' }
        }
      ])
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground font-montserrat-alt">Lädt...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!session?.user) {
    return null
  }

  const user = session.user
  const firstName = user.name?.split(' ')[0] || user.email?.split('@')[0] || 'User'
  const lastName = user.name?.split(' ').slice(1).join(' ') || ''
  const memberNumber = user.id?.slice(-8).toUpperCase() || 'DEMO1234'
  const joinDate = new Date()

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="p-6 space-y-8 font-montserrat-alt">
        {/* Header Section */}
        <div className="text-center mb-6">
          <SpanDesign>Deine Zentrale</SpanDesign>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-cinzel-decorative font-normal text-foreground mb-3">
            Willkommen zurück, {firstName}
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Setze deine spirituelle Reise fort und erweitere dein Bewusstsein
          </p>
        </div>

        {/* User Info Card */}
        <Card className="glass-card-strong">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <Avatar className="w-16 h-16 border-2 border-primary/20">
                <AvatarImage
                  src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}&backgroundColor=1a2a3a`}
                  alt={user.name || 'User'}
                />
                <AvatarFallback className="bg-primary/20 text-primary text-base">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    <span className="text-muted-foreground font-light">Mitgliedsnummer:</span>
                    <span className="font-mono font-normal text-primary">{memberNumber}</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0E282E] border border-primary/10 rounded-lg">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground font-light">Mitglied seit:</span>
                    <span className="font-normal text-foreground">
                      {joinDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button asChild size="sm" className="gap-2 font-normal">
                  <Link href="/bibliothek">
                    <BookOpen className="h-4 w-4" />
                    Bibliothek
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="gap-2 font-normal" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Abmelden
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="max-w-xs">
          {/* Total Courses */}
          <Card className="glass-card glass-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-normal text-foreground">
                  {stats?.totalCourses || 0}
                </p>
              </div>
              <p className="text-xs text-muted-foreground font-light">Aktive Kurse</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <Card className="glass-card-strong">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-cinzel-decorative font-normal flex items-center gap-2">
                      <Play className="h-5 w-5 text-primary" />
                      Zuletzt angesehen
                    </CardTitle>
                    <CardDescription className="font-light">
                      Deine zuletzt angesehenen Kurse
                    </CardDescription>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="font-normal">
                    <Link href="/bibliothek" className="gap-2">
                      Alle anzeigen
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground font-light">
                      Du hast noch keine Kurse. Entdecke unsere Kurse und starte deine Reise!
                    </p>
                    <Button asChild size="sm" className="mt-4 font-normal">
                      <Link href="/courses">
                        Kurse durchstöbern
                      </Link>
                    </Button>
                  </div>
                ) : (
                  recentCourses.map((course) => (
                    <Link key={course.id} href={`/courses/${course.slug}/learn`}>
                      <Card className="glass-subtle glass-hover group cursor-pointer">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            {/* Thumbnail */}
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5">
                              {course.thumbnail_url_desktop ? (
                                <img
                                  src={course.thumbnail_url_desktop}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen className="h-8 w-8 text-primary/30" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-normal text-sm text-foreground truncate mb-1 group-hover:text-primary transition-colors">
                                {course.title}
                              </h3>
                              {course.subtitle && (
                                <p className="text-xs text-muted-foreground font-light mb-2 line-clamp-2">
                                  {course.subtitle}
                                </p>
                              )}

                              <p className="text-xs text-muted-foreground font-light">
                                Zuletzt angesehen: {new Date(course.last_viewed || course.purchase_date).toLocaleDateString('de-DE')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-cinzel-decorative font-normal flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Schnellzugriff
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start gap-3 font-light" size="sm">
                  <Link href="/bibliothek">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Bibliothek</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full justify-start gap-3 font-light" size="sm">
                  <Link href="/courses">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Kurse durchstöbern</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full justify-start gap-3 font-light" size="sm">
                  <Link href="/magazine">
                    <Globe className="h-4 w-4 text-primary" />
                    <span>Magazin</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Belege */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-cinzel-decorative font-normal flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" />
                    Belege
                  </CardTitle>
                  <Button asChild variant="ghost" size="sm" className="font-normal">
                    <Link href="/belege" className="gap-2 text-xs">
                      Alle Belege
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground font-light">
                      Noch keine Bestellungen vorhanden
                    </p>
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <Card key={order.id} className="glass-subtle glass-hover">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Receipt className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                              <p className="text-xs font-mono text-muted-foreground">
                                {order.ablefy_order_number || order.id.slice(0, 8)}
                              </p>
                            </div>
                            {order.courses && (
                              <p className="text-sm text-foreground font-light truncate mb-1">
                                {order.courses.title}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground font-light">
                              {new Date(order.order_date).toLocaleDateString('de-DE', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              order.status === 'paid' || order.status === 'Erfolgreich'
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {order.status}
                            </div>
                            {order.total_amount && (
                              <p className="text-sm font-medium text-foreground mt-1">
                                €{order.total_amount}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
