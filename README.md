# MediCare - Sistema de Diagnóstico Médico

Aplicación médica profesional construida con Next.js, Prisma y MongoDB Atlas.

## Características

- 🔐 **Autenticación Básica**: Sistema de login y registro seguro
- 👥 **Gestión de Pacientes**: Historial completo de pacientes con información médica
- 📸 **Diagnóstico por Cámara**: Captura de imágenes desde cualquier dispositivo
- 🎨 **Diseño Moderno**: Inspirado en Facebook/Meta con animaciones Framer Motion
- 💾 **Base de Datos**: MongoDB Atlas con Prisma ORM

## Tecnologías

- **Framework**: Next.js 15 (App Router)
- **Base de Datos**: MongoDB Atlas + Prisma
- **Autenticación**: bcryptjs
- **Animaciones**: Framer Motion
- **Estilos**: Tailwind CSS v4
- **UI Components**: shadcn/ui

## Configuración

### 1. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar MongoDB Atlas

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuevo cluster
3. Obtén tu connection string
4. Crea un archivo \`.env\` en la raíz del proyecto:

\`\`\`env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/medical-app?retryWrites=true&w=majority"
NEXTAUTH_SECRET="tu-clave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

### 3. Configurar Prisma

\`\`\`bash
# Generar el cliente de Prisma
npx prisma generate

# Sincronizar el esquema con la base de datos
npx prisma db push
\`\`\`

### 4. Ejecutar la Aplicación

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

\`\`\`
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # Autenticación
│   │   ├── patients/     # Gestión de pacientes
│   │   └── diagnosis/    # Diagnósticos
│   ├── dashboard/        # Panel principal
│   │   ├── patients/     # Historial de pacientes
│   │   └── diagnosis/    # Módulo de cámara
│   ├── layout.tsx
│   ├── page.tsx          # Login
│   └── globals.css
├── components/
│   ├── ui/               # Componentes UI
│   └── auth-guard.tsx    # Protección de rutas
├── lib/
│   ├── prisma.ts         # Cliente Prisma
│   └── auth.ts           # Utilidades de autenticación
├── prisma/
│   └── schema.prisma     # Esquema de base de datos
└── package.json
\`\`\`

## Modelos de Base de Datos

### User (Usuario/Doctor)
- email, password, name, role
- Relación: tiene muchos pacientes

### Patient (Paciente)
- name, age, gender, phone, email, address
- medicalHistory (historial médico)
- Relación: pertenece a un doctor, tiene muchos diagnósticos

### Diagnosis (Diagnóstico)
- description, notes, images (array de URLs)
- Relación: pertenece a un paciente

## Funcionalidades

### Autenticación
- Registro de nuevos usuarios (doctores)
- Login con email y contraseña
- Protección de rutas privadas

### Gestión de Pacientes
- Crear nuevos pacientes
- Ver lista de pacientes
- Buscar pacientes por nombre
- Almacenar historial médico completo

### Diagnóstico por Cámara
- Acceso a cámara del dispositivo (móvil/laptop)
- Captura múltiple de imágenes
- Asociar imágenes a pacientes
- Guardar diagnósticos con notas

## Despliegue

### Vercel (Recomendado)

1. Haz push de tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Despliega

### Variables de Entorno en Producción

Asegúrate de configurar estas variables en tu plataforma de despliegue:
- \`DATABASE_URL\`
- \`NEXTAUTH_SECRET\`
- \`NEXTAUTH_URL\`

## Seguridad

- Las contraseñas se hashean con bcrypt
- Autenticación basada en sesiones
- Validación de datos en el servidor
- Protección de rutas privadas

## Soporte

Para problemas o preguntas, abre un issue en el repositorio.

## Licencia

MIT
\`\`\`
