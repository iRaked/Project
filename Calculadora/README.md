# 🧮 Calculadora JavaScript

Una calculadora completa implementada en JavaScript con operaciones matemáticas básicas y avanzadas, incluyendo tests unitarios, un programa principal interactivo y una **interfaz web moderna** lista para GitHub Pages.

## ✨ Características

- **🌐 Interfaz Web Moderna**: Diseño responsive y atractivo
- **⌨️ Soporte de Teclado**: Usa tu teclado para operar la calculadora
- **📱 Diseño Responsive**: Funciona perfectamente en móviles y tablets
- **🎨 UI/UX Profesional**: Interfaz moderna con animaciones y efectos
- **Operaciones Básicas**: Suma, resta, multiplicación y división
- **Operaciones Avanzadas**: Potencia, raíz cuadrada y porcentajes
- **Validación de Entrada**: Manejo de errores y validación de tipos
- **Historial Interactivo**: Registro de operaciones con clic para reutilizar
- **Tests Unitarios**: Cobertura completa con Jest
- **Programa Interactivo**: Interfaz de línea de comandos
- **🚀 GitHub Pages Ready**: Listo para desplegar en GitHub Pages

## 🌐 Demo en Vivo

**¡Prueba la calculadora ahora mismo!** 
👉 [Ver Demo en GitHub Pages](https://tu-usuario.github.io/calculadora-javascript)

## 🚀 Instalación

### Opción 1: Usar la versión web (Recomendado)
1. Simplemente abre `index.html` en tu navegador
2. ¡Listo! La calculadora está lista para usar

### Opción 2: Desarrollo local
1. Clona o descarga el proyecto
2. Instala las dependencias:

```bash
npm install
```

## 📋 Uso

### 🌐 Interfaz Web (Recomendado)
```bash
# Abrir directamente en el navegador
open index.html
# o simplemente hacer doble clic en index.html
```

### 💻 Programa de línea de comandos
```bash
npm start
```

### 🧪 Ejecutar los tests
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

## 🧪 Tests

El proyecto incluye tests unitarios completos que cubren:

- ✅ Operaciones básicas (suma, resta, multiplicación, división)
- ✅ Operaciones avanzadas (potencia, raíz cuadrada, porcentaje)
- ✅ Validación de entrada y manejo de errores
- ✅ Funcionalidad del historial
- ✅ Casos edge y números especiales

### Ejecutar tests específicos

```bash
# Ejecutar un test específico
npm test -- --testNamePattern="sumar"

# Ejecutar tests con cobertura
npm test -- --coverage
```

## 📁 Estructura del Proyecto

```
calculadora/
├── 🌐 Archivos Web
│   ├── index.html           # Página principal de la calculadora web
│   ├── styles.css           # Estilos CSS modernos y responsive
│   ├── app.js              # Lógica de la interfaz web
│   └── calculadora-web.js  # Clase Calculadora para el navegador
├── 💻 Archivos de Consola
│   ├── src/
│   │   ├── calculadora.js    # Clase principal de la calculadora
│   │   └── main.js          # Programa principal interactivo
│   └── tests/
│       └── calculadora.test.js  # Tests unitarios
├── ⚙️ Configuración
│   ├── package.json         # Configuración del proyecto
│   ├── jest.config.js       # Configuración de Jest
│   └── .gitignore          # Archivos a ignorar en Git
└── 📖 Documentación
    └── README.md           # Este archivo
```

## 🔧 API de la Calculadora

### Métodos Disponibles

```javascript
const calculadora = new Calculadora();

// Operaciones básicas
calculadora.sumar(a, b)           // Suma dos números
calculadora.restar(a, b)          // Resta dos números
calculadora.multiplicar(a, b)     // Multiplica dos números
calculadora.dividir(a, b)         // Divide dos números

// Operaciones avanzadas
calculadora.potencia(base, exp)   // Calcula base^exponente
calculadora.raizCuadrada(num)     // Calcula √número
calculadora.porcentaje(num, pct)  // Calcula porcentaje

// Gestión del historial
calculadora.obtenerHistorial()    // Obtiene el historial
calculadora.limpiarHistorial()    // Limpia el historial
```

### Ejemplo de Uso

```javascript
const Calculadora = require('./src/calculadora');
const calc = new Calculadora();

// Realizar operaciones
console.log(calc.sumar(5, 3));        // 8
console.log(calc.multiplicar(4, 6));  // 24
console.log(calc.potencia(2, 3));     // 8

// Ver historial
console.log(calc.obtenerHistorial());
// ['5 + 3 = 8', '4 * 6 = 24', '2^3 = 8']
```

## ⚠️ Manejo de Errores

La calculadora incluye validación robusta:

- **División por cero**: Lanza error al intentar dividir por cero
- **Raíz cuadrada negativa**: Lanza error para números negativos
- **Argumentos inválidos**: Valida que los argumentos sean números válidos

## 🎯 Funcionalidades del Programa Principal

El programa principal (`main.js`) incluye:

1. **Demostración automática** de todas las funcionalidades
2. **Menú interactivo** para realizar operaciones
3. **Gestión del historial** (ver y limpiar)
4. **Manejo de errores** con mensajes informativos
5. **Interfaz amigable** con emojis y formato claro

## 📊 Cobertura de Tests

Los tests cubren:
- ✅ 100% de los métodos públicos
- ✅ Casos de éxito y error
- ✅ Validación de entrada
- ✅ Funcionalidad del historial
- ✅ Casos edge (números grandes, decimales, negativos)

## 🛠️ Tecnologías Utilizadas

- **JavaScript ES6+**: Lenguaje principal
- **Jest**: Framework de testing
- **Node.js**: Entorno de ejecución
- **Readline**: Interfaz de línea de comandos

## 🚀 Desplegar en GitHub Pages

### Paso 1: Subir a GitHub
1. Crea un nuevo repositorio en GitHub
2. Sube todos los archivos del proyecto:
```bash
git init
git add .
git commit -m "Initial commit: Calculadora JavaScript con interfaz web"
git branch -M main
git remote add origin https://github.com/tu-usuario/calculadora-javascript.git
git push -u origin main
```

### Paso 2: Activar GitHub Pages
1. Ve a la pestaña **Settings** de tu repositorio
2. Desplázate hasta la sección **Pages**
3. En **Source**, selecciona **Deploy from a branch**
4. Selecciona la rama **main** y la carpeta **/ (root)**
5. Haz clic en **Save**

### Paso 3: ¡Listo!
Tu calculadora estará disponible en:
`https://tu-usuario.github.io/calculadora-javascript`

### 🔗 Personalizar el enlace
Recuerda cambiar `tu-usuario` por tu nombre de usuario real de GitHub en:
- El enlace del README
- El enlace del footer en `index.html`

## 🎯 Características de la Interfaz Web

### ⌨️ Atajos de Teclado
- **Números (0-9)**: Ingresar números
- **Operadores (+, -, *, /)**: Seleccionar operación
- **Enter o =**: Calcular resultado
- **Escape**: Limpiar todo
- **Backspace**: Borrar último dígito
- **Punto (.)**: Agregar decimal

### 📱 Diseño Responsive
- **Desktop**: Interfaz completa con todos los paneles
- **Tablet**: Layout adaptado para pantallas medianas
- **Móvil**: Interfaz optimizada para touch

### 🎨 Características Visuales
- **Tema moderno**: Gradientes y efectos glassmorphism
- **Animaciones suaves**: Transiciones y hover effects
- **Iconos FontAwesome**: Interfaz intuitiva
- **Notificaciones**: Feedback visual para todas las acciones

## 📝 Licencia

MIT License - Puedes usar este proyecto libremente para fines educativos y comerciales.

---

¡Disfruta calculando! 🧮✨
