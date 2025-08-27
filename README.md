# 🚀 FastlyGo Admin

Panel de administración para la plataforma FastlyGo, construido con React, TypeScript, Tailwind CSS y Zustand.

## ✨ Características

- 🎨 **Diseño Responsivo** - Interfaz moderna y adaptable a todos los dispositivos
- 🌓 **Modo Oscuro/Claro** - Tema dinámico con transiciones suaves
- 🔐 **Autenticación** - Sistema de login y rutas protegidas
- 📊 **Dashboard Interactivo** - 8 módulos principales con navegación
- 🔌 **API Integration** - Servicio con axios interceptors para FastlyGo API
- 📱 **Componentes Reutilizables** - Arquitectura modular y escalable

## 🛠️ Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utility-first
- **Zustand** - Gestión de estado ligera
- **React Router** - Enrutamiento de la aplicación
- **Axios** - Cliente HTTP para peticiones API
- **Vite** - Herramienta de construcción rápida

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd fastlygo-admin
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de la construcción
npm run preview

# Linting
npm run lint
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Dashboard.tsx
│   ├── NavBarHeader.tsx
│   ├── ThemeToggle.tsx
│   └── UserDropdown.tsx
├── pages/              # Páginas principales
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   └── [módulos]/
├── routes/             # Configuración de rutas
│   ├── AppRouter.tsx
│   └── DashBoardRouter.tsx
├── services/           # Servicios API
│   └── api.ts
├── stores/             # Estado global (Zustand)
│   ├── authStore.ts
│   ├── businessStore.ts
│   └── themeStore.ts
├── hooks/              # Hooks personalizados
└── styles/             # Estilos globales
```

## 🎯 Módulos del Dashboard

1. **🏪 Franchise & Delivery Management** - Gestión de franquicias
2. **📊 Franchise Sales Report** - Reportes de ventas
3. **📢 Franchise Promotions** - Promociones
4. **📋 Activity Log** - Registro de actividades
5. **💰 Salary & Transfers** - Salarios y transferencias
6. **👥 User Management** - Gestión de usuarios
7. **📢 Notices & Communications** - Avisos y comunicaciones
8. **🎯 Support & Reports** - Soporte y reportes

## 🔌 API Integration

El proyecto incluye un servicio completo para interactuar con la API de FastlyGo:

```typescript
import { apiService } from './services/api';

// Obtener businesses
const businesses = await apiService.getBusinesses(true);

// Petición genérica
const response = await apiService.get('https://dev.fastlygo.net/api/Business', {
  activeOnly: true
});
```

## 🎨 Temas y Estilos

- **Modo Claro**: Color principal `#00C4B4` para tarjetas y botones
- **Modo Oscuro**: Colores oscuros con texto blanco
- **CSS Variables**: Sistema de variables personalizables
- **Tailwind CSS**: Clases utility para estilos rápidos

## 🔐 Autenticación

- **Rutas Protegidas**: Acceso controlado a módulos
- **Store de Autenticación**: Estado global con Zustand
- **Redirección Automática**: Navegación inteligente según estado

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Grid System**: Layout adaptable con CSS Grid
- **Breakpoints**: Puntos de quiebre para diferentes dispositivos

## 🚀 Despliegue

```bash
# Construir para producción
npm run build

# Los archivos se generan en /dist
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo.

---

**Desarrollado para FastlyGo**