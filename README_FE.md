Tecnologías Utilizadas
Framework: Vue.js 3 (Composition API)

Build Tool: Vite

Estilos: Tailwind CSS

Cliente HTTP: Axios

Iconos/Assets: Recursos locales en src/assets/

Estructura del Proyecto
Plaintext
src/
├── assets/             # Imágenes (logo, no-image.png) y CSS global.
├── components/         # Componentes reutilizables (Modal.vue, etc).
├── views/              # Vistas principales (Products, Cart, Order, Login).
├── services/           # Configuración de Axios e interceptores de JWT.
├── router/             # Configuración de rutas (Vue Router).
├── App.vue             # Componente raíz.
└── main.js             # Punto de entrada de la aplicación.
Inicio Rápido
1. Requisitos previos
Node.js (Versión 18.x o superior recomendada)

NPM o Yarn

2. Instalación
Clona el repositorio e instala las dependencias:

Bash
git clone <url-del-repositorio>
cd sportx-frontend
npm install
3. Configuración de Variables de Entorno
Crea un archivo .env en la raíz del proyecto y añade la URL de tu backend (serverless-offline o producción):

Fragmento de código
VITE_API_URL=http://localhost:3000/dev
4. Ejecución en desarrollo
Bash
npm run dev
La aplicación estará disponible en http://localhost:5173.

Características Implementadas
Seguridad y Sesión
Persistencia: El token JWT se almacena localmente y se adjunta automáticamente a las peticiones mediante un interceptor de Axios.

Autorización: Las vistas de Carrito y Pedidos están protegidas y requieren inicio de sesión.

Gestión de Productos
Paginación Inteligente: Carga de 5 productos por página para optimizar el rendimiento.

Manejo de Imágenes: Sistema de fallback que muestra no-image.png si el enlace de la base de datos falla o es nulo.

Flujo de Compra
Validación de Stock: El frontend notifica si el stock en DynamoDB es insuficiente antes de completar el checkout.

Sincronización: El carrito se cruza con los datos más recientes de los productos para asegurar precios actualizados.

Scripts Disponibles
npm run dev: Inicia el servidor de desarrollo con Hot Module Replacement (HMR).

