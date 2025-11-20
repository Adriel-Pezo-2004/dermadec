
# Documentación Técnica: MI APP

## 1. Introducción

Este documento detalla la arquitectura técnica, la estructura del proyecto y las convenciones de codificación de **MI APP**. El propósito de esta aplicación es ofrecer una plataforma para que los profesionales de la salud (doctores) gestionen la información de sus pacientes y los diagnósticos asociados.

La aplicación es una aplicación web construida con tecnologías modernas, enfocada en la gestión de datos y con una interfaz de usuario clara y funcional.

## 2. Lenguajes y Entorno de Desarrollo

### 2.1. Lenguajes de Programación

*   **TypeScript:** Es el lenguaje principal utilizado en todo el proyecto, tanto en el frontend como en el backend. Aporta tipado estático a JavaScript, lo que mejora la robustez y mantenibilidad del código.
*   **JavaScript:** Utilizado implícitamente, ya que TypeScript compila a JavaScript.

### 2.2. Entorno de Desarrollo

*   **Next.js:** Framework de React para construir aplicaciones web del lado del servidor (SSR) y estáticas. Gestiona el enrutamiento, la renderización y la API del backend.
*   **React:** Biblioteca para construir interfaces de usuario interactivas y componentizadas.
*   **Node.js:** Entorno de ejecución para JavaScript del lado del servidor, sobre el que corre Next.js.
*   **Prisma:** ORM para Node.js y TypeScript. Se utiliza para interactuar con la base de datos de una manera segura y tipada.
*   **MongoDB:** La base de datos utilizada en el proyecto. Es una base de datos NoSQL orientada a documentos, gestionada a través de Prisma.
*   **Tailwind CSS:** Framework de CSS "utility-first" para un diseño rápido y personalizado de la interfaz de usuario.
*   **Shadcn/UI:** Colección de componentes de UI reutilizables, construidos sobre Radix UI y Tailwind CSS.

## 3. Organización del Proyecto

### 3.1. Estructura del Proyecto

El proyecto sigue la estructura de un monorepositorio con el frontend y el backend en el mismo lugar, gestionado por Next.js.

```
/
├── app/                # Directorio principal de la aplicación (App Router de Next.js)
│   ├── api/            # Rutas de la API del backend
│   │   ├── auth/       # Endpoints para autenticación (login, registro)
│   │   ├── diagnosis/  # Endpoints para gestionar diagnósticos
│   │   └── patients/   # Endpoints para gestionar pacientes
│   ├── dashboard/      # Rutas protegidas de la aplicación
│   │   ├── diagnosis/  # UI para la gestión de diagnósticos
│   │   └── patients/   # UI para la gestión de pacientes
│   ├── globals.css     # Estilos globales
│   └── layout.tsx      # Layout principal de la aplicación
│   └── page.tsx        # Página de inicio (pública)
├── components/         # Componentes de React reutilizables
│   ├── ui/             # Componentes de Shadcn/UI
│   └── auth-guard.tsx  # Componente para proteger rutas
├── lib/                # Módulos y utilidades compartidas
│   ├── auth.ts         # Lógica de autenticación
│   ├── prisma.ts       # Instancia y configuración de Prisma
│   └── utils.ts        # Funciones de utilidad
├── prisma/             # Configuración de Prisma
│   └── schema.prisma   # Esquema de la base de datos
├── public/             # Archivos estáticos
│   └── model/          # Modelo de Machine Learning (TensorFlow.js)
├── package.json        # Dependencias y scripts del proyecto
└── tsconfig.json       # Configuración de TypeScript
```

### 3.2. Librerías de Terceros

A continuación se listan las dependencias más importantes del proyecto:

*   **`next`**: Framework principal de la aplicación.
*   **`react`**: Biblioteca para la construcción de la interfaz de usuario.
*   **`@prisma/client`**: Cliente de Prisma para interactuar con la base de datos.
*   **`@tensorflow/tfjs`**: Biblioteca para utilizar modelos de Machine Learning en el navegador.
*   **`bcryptjs`**: Librería para el hasheo de contraseñas.
*   **`zod`**: Librería para la validación de esquemas y datos.
*   **`lucide-react`**: Paquete de iconos.
*   **`tailwindcss`**: Framework de CSS.
*   **`shadcn-ui` (a través de `@radix-ui/*`)**: Componentes de UI.
*   **`react-hook-form`**: Gestión de formularios.

### 3.3. Código Fuente

#### Backend (API)

La lógica del backend reside en las "Route Handlers" de Next.js, dentro de `app/api/`.

*   **Autenticación (`/api/auth`)**:
    *   `POST /api/auth/register`: Registra un nuevo usuario (doctor).
    *   `POST /api/auth/login`: Autentica a un usuario y genera una sesión.
*   **Pacientes (`/api/patients`)**: Endpoints para operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre los pacientes.
*   **Diagnósticos (`/api/diagnosis`)**: Endpoints para operaciones CRUD sobre los diagnósticos de los pacientes.

#### Frontend

El frontend está construido con React y componentes de Shadcn/UI.

*   **`app/dashboard`**: Contiene las páginas principales de la aplicación una vez que el usuario está autenticado.
*   **`components/`**: Contiene componentes reutilizables como botones, formularios, tablas, etc.
*   **`lib/`**: La lógica de cliente para interactuar con la API y otras utilidades se encuentra aquí.

#### Base de Datos

El esquema de la base de datos se define en `prisma/schema.prisma`. Incluye los siguientes modelos:

*   **`User`**: Representa a los doctores que utilizan la aplicación.
*   **`Patient`**: Representa a los pacientes, con una relación al `User` (su doctor).
*   **`Diagnosis`**: Representa los diagnósticos, con una relación al `Patient`.

## 4. Manual del Programador

### 4.1. Requisitos Previos

*   Node.js (versión 22 o superior)
*   `pnpm` como gestor de paquetes (`npm install -g pnpm`)
*   Una base de datos MongoDB en ejecución.

### 4.2. Instalación

1.  Clonar el repositorio.
2.  Crear un archivo `.env` en la raíz del proyecto y configurar la variable de entorno `DATABASE_URL` con la cadena de conexión de MongoDB.
    ```
    DATABASE_URL="mongodb+srv://user:password@host/database"
    ```
3.  Instalar las dependencias del proyecto:
    ```bash
    pnpm install
    ```
4.  Aplicar el esquema de Prisma a la base de datos:
    ```bash
    pnpm prisma db push
    ```

### 4.3. Ejecución

Para iniciar el servidor de desarrollo local:

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

### 4.4. Scripts Disponibles

*   `pnpm dev`: Inicia el servidor de desarrollo.
*   `pnpm build`: Compila la aplicación para producción.
*   `pnpm start`: Inicia el servidor de producción (requiere `pnpm build` previo).
*   `pnpm lint`: Ejecuta el linter de Next.js para verificar la calidad del código.

## 5. Bibliografía

*(Esta sección se deja intencionadamente en blanco. Se puede completar con enlaces a la documentación oficial de las tecnologías utilizadas si se considera necesario).*
