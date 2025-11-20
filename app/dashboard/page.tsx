"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Users, Camera, LogOut } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const menuItems = [
    {
      title: "Historial de Pacientes",
      description: "Gestiona y consulta el historial médico de tus pacientes",
      icon: Users,
      href: "/dashboard/patients",
      color: "from-[#1877f2] to-[#166fe5]",
    },
    {
      title: "Diagnóstico por Cámara",
      description: "Captura imágenes y realiza diagnósticos visuales",
      icon: Camera,
      href: "/dashboard/diagnosis",
      color: "from-[#7c3aed] to-[#6d28d9]",
    },
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1877f2] to-[#7c3aed] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 font-display">DermaDec</h1>
                  <p className="text-xs text-gray-600">Sistema Médico</p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-display mb-2">Panel de Control</h2>
            <p className="text-gray-600">Selecciona una opción para comenzar</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => router.push(item.href)}
                  className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-left border border-gray-100 group"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </button>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
