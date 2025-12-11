# 📋 INFORME DE CAPACIDADES - TRAINTRACKER

**Desarrollado por:** Francisco Sanz  
**Versión:** 1.0  
**Fecha:** 2024

---

## 🎯 RESUMEN EJECUTIVO

TrainTracker es una **aplicación web progresiva (PWA)** completa y avanzada para el seguimiento de entrenamientos de fuerza. Diseñada con un enfoque en rendimiento extremo, ofrece una experiencia fluida incluso en dispositivos móviles de baja potencia. La aplicación combina funcionalidades de registro, análisis, gamificación y personalización en una interfaz moderna y responsive.

---

## 📝 1. DIARIO DE ENTRENAMIENTOS

### 1.1 Gestión de Sesiones
- ✅ **Creación de sesiones**: Sistema completo para crear nuevas sesiones de entrenamiento
- ✅ **Navegación semanal**: Navegación entre semanas (anterior/siguiente) con indicador visual
- ✅ **Edición de sesiones**: Modificación de nombre y fecha de sesiones existentes
- ✅ **Eliminación de sesiones**: Borrado con confirmación de seguridad
- ✅ **Marcado de completado**: Sistema para marcar sesiones como completadas
- ✅ **Copia de semana anterior**: Función para copiar el día actual de la semana pasada
- ✅ **Limpieza de semana**: Opción para eliminar todas las sesiones de la semana actual

### 1.2 Gestión de Ejercicios
- ✅ **Añadir ejercicios**: Sistema para agregar ejercicios a cualquier sesión
- ✅ **Edición de nombres**: Edición inline de nombres de ejercicios (doble clic o clic directo)
- ✅ **Eliminación de ejercicios**: Borrado con confirmación
- ✅ **Reordenamiento**: Botones para mover ejercicios arriba/abajo dentro de una sesión
- ✅ **Notas por ejercicio**: Sistema completo de notas para cada ejercicio (añadir, editar, eliminar)
- ✅ **Visualización de notas**: Indicador visual cuando un ejercicio tiene nota

### 1.3 Gestión de Sets
- ✅ **Añadir sets**: Sistema para agregar múltiples sets a cada ejercicio
- ✅ **Registro de datos**:
  - Peso (KG) con soporte decimal
  - Repeticiones (Reps) con soporte para rangos (ej: "8+2", "10-12")
  - RIR (Repeticiones en Reserva) con soporte para rangos (ej: "2/3")
- ✅ **Valores planificados**: Sistema de plantillas con valores sugeridos (planKg, planReps, planRir)
- ✅ **Eliminación de sets**: Borrado individual de sets
- ✅ **Numeración automática**: Los sets se numeran automáticamente

### 1.4 Funcionalidades Avanzadas del Diario
- ✅ **Visualización de semana pasada**: Botón para ver datos del mismo ejercicio/set de la semana anterior
  - Los datos aparecen con el color del tema seleccionado
  - Restauración de valores originales al enfocar inputs
- ✅ **Temporizador de descanso**: Sistema completo de temporizador entre sets
  - Ventana flotante centrada en móvil
  - Selección de tiempo (1, 2, 3, 4 minutos)
  - Mensaje de finalización
  - Cancelación opcional
- ✅ **Comparación de progreso**: Sistema automático que compara cada set con el anterior
  - Indicadores visuales: ↑ (mejora), ↓ (disminución), = (sin cambio)
  - Mensajes descriptivos: "+2.5 kg en set 1", "Más reps: 8 → 10", etc.
- ✅ **Rendimiento optimizado**: 
  - Renderizado incremental (solo estructura inicial)
  - Cálculos diferidos en segundo plano
  - Event delegation global (un solo listener para todos los inputs)
  - Batch DOM updates para minimizar reflows
  - Lazy loading de ejercicios (solo cuando se abre la sesión)

### 1.5 Resumen Semanal
- ✅ **KPIs automáticos**:
  - Número de sesiones completadas
  - Ejercicio con más progreso (basado en volumen)
  - Volumen total (suma de kg × reps)
  - RIR promedio

---

## 📊 2. ESTADÍSTICAS Y ANÁLISIS

### 2.1 Gráficos Interactivos
- ✅ **Gráfico de progreso semanal**: Visualización de métricas a lo largo del tiempo
- ✅ **Múltiples métricas**: 
  - Volumen total
  - Peso máximo
  - RIR promedio
- ✅ **Períodos comparativos**:
  - Última semana
  - Hace 4 semanas
  - Hace 8 semanas
  - Desde el principio
- ✅ **Responsive**: Gráficos adaptados para móvil y escritorio

### 2.2 Estadísticas por Ejercicio
- ✅ **Análisis detallado**: Estadísticas específicas para cada ejercicio
- ✅ **Métricas calculadas**:
  - Peso máximo levantado
  - Total de repeticiones
  - Volumen total
  - RIR promedio
  - Número de sesiones

### 2.3 Cálculos Automáticos
- ✅ **1RM (Repetición Máxima)**: Cálculo automático usando fórmulas:
  - Epley
  - Brzycki
  - Wendler
  - Promedio de las tres fórmulas
- ✅ **Detección de PRs (Récords Personales)**:
  - PR de peso
  - PR de volumen
  - PR de repeticiones
  - PR de 1RM
  - Badges visuales (🏆) cuando se detecta un PR

---

## 🎯 3. SISTEMA DE OBJETIVOS

### 3.1 Tipos de Objetivos
- ✅ **Objetivo de Peso**: Meta de peso específico para un ejercicio
- ✅ **Objetivo de Volumen**: Meta de volumen total (kg × reps)
- ✅ **Objetivo de Repeticiones**: Meta de número de repeticiones
- ✅ **Objetivo de Repeticiones con Peso**: Meta de repeticiones con un peso específico
  - Campo de peso objetivo (KG)
  - Campo de repeticiones objetivo

### 3.2 Sistema de Hitos
- ✅ **Hitos automáticos**: Generación automática de hitos intermedios
- ✅ **Formato de hitos**:
  - "X REPS" para objetivos de repeticiones
  - "X KG" para objetivos de peso
- ✅ **Visualización diferenciada**: 
  - Objetivos completados con un nivel de transparencia
  - Hitos completados con otro nivel de transparencia
- ✅ **Ajuste adaptativo**: Los objetivos se ajustan automáticamente basándose en el rendimiento

### 3.3 Seguimiento de Progreso
- ✅ **Barras de progreso**: Visualización del progreso hacia cada objetivo
- ✅ **Cálculo automático**: El progreso se actualiza automáticamente al completar sesiones
- ✅ **Celebraciones**: Animaciones y confeti al alcanzar objetivos o hitos

### 3.4 Gestión de Objetivos
- ✅ **Creación**: Formulario completo para crear nuevos objetivos
- ✅ **Edición**: Modificación de objetivos existentes
- ✅ **Eliminación**: Borrado con confirmación
- ✅ **Visualización**: Lista organizada de todos los objetivos activos y completados

---

## 🏆 4. MODO COMPETITIVO Y GAMIFICACIÓN

### 4.1 Sistema de Niveles
- ✅ **50 niveles**: Sistema completo de 50 niveles de progreso
- ✅ **Cálculo basado en días**: Los niveles se calculan según días de entrenamiento completados
- ✅ **Medallas por nivel**: Cada nivel tiene su medalla única
- ✅ **Barra de progreso**: Visualización del progreso hacia el siguiente nivel
- ✅ **Estadísticas de nivel**: 
  - Días completados
  - Días hasta el siguiente nivel
  - Porcentaje de progreso
- ✅ **Animación de subida de nivel**: Efecto visual especial al subir de nivel
  - Confeti
  - Animación de celebración
  - Mensaje de felicitación

### 4.2 Sistema de Logros
- ✅ **Logros desbloqueables**: Sistema de logros por alcanzar metas
- ✅ **Logros recientes**: Visualización de logros recientemente desbloqueados
- ✅ **Todos los logros**: Lista completa de logros disponibles
- ✅ **Categorías de logros**:
  - Por número de sesiones
  - Por racha de entrenamiento
  - Por objetivos alcanzados
  - Por hitos completados

### 4.3 Rachas de Entrenamiento
- ✅ **Racha actual**: Seguimiento de días consecutivos entrenando
- ✅ **Racha máxima**: Registro de la racha más larga alcanzada
- ✅ **Visualización**: Indicador visual de la racha en el perfil

### 4.4 Animaciones de Celebración
- ✅ **Animación "Fiesta"**: Efecto visual al completar sesiones
- ✅ **Confeti**: Efectos de confeti en momentos importantes
- ✅ **Animaciones de nivel**: Celebración especial al subir de nivel
- ✅ **Celebración de objetivos**: Animaciones al alcanzar objetivos o hitos

---

## 🧩 5. GESTIÓN DE RUTINAS

### 5.1 Creación de Rutinas
- ✅ **Constructor visual**: Interfaz completa para crear rutinas personalizadas
- ✅ **Múltiples días**: Añadir tantos días como se necesite
- ✅ **Múltiples ejercicios**: Añadir ejercicios a cada día
- ✅ **Múltiples sets**: Configurar número de sets por ejercicio (por defecto 3 para rutina PPL)
- ✅ **Valores planificados**: Establecer peso, reps y RIR planificados para cada set
- ✅ **Reordenamiento**: Mover días y ejercicios dentro de la rutina
- ✅ **Edición**: Modificar rutinas existentes

### 5.2 Plantillas Predefinidas
- ✅ **Rutina 3 días**: Plantilla básica de 3 días
- ✅ **Rutina 4 días**: Plantilla de 4 días (Upper/Lower split)
- ✅ **Rutina 5 días**: Plantilla de 5 días
- ✅ **Rutina PPL 6 días**: Plantilla Push/Pull/Legs de 6 días
  - 3 series por defecto en cada ejercicio
  - 6 días de entrenamiento
  - Ejercicios predefinidos para cada día

### 5.3 Importación y Exportación
- ✅ **Importar rutinas**: Cargar rutinas desde archivos JSON
- ✅ **Exportar rutinas**: Descargar rutinas en formato JSON
- ✅ **Importar a semana**: Importar rutinas directamente a la semana actual
- ✅ **Vista previa**: Visualización previa antes de importar
- ✅ **Validación**: Sistema de validación de datos antes de importar
- ✅ **Mensajes de error**: Información detallada de errores en la importación

### 5.4 Organización
- ✅ **Rutinas creadas**: Las rutinas personalizadas aparecen primero
- ✅ **Rutinas por defecto**: Las plantillas aparecen después
- ✅ **Lista organizada**: Visualización clara de todas las rutinas disponibles

---

## 👤 6. PERFIL PERSONAL

### 6.1 Información Personal
- ✅ **Datos básicos**:
  - Nombre completo (nombre y apellidos)
  - Altura
  - Peso actual
  - Porcentaje de grasa corporal
- ✅ **Foto de perfil**: 
  - Subida de imagen personal
  - Generación de avatar con DiceBear (múltiples estilos)
  - Seed personalizado para avatares

### 6.2 Historial
- ✅ **Historial de peso**: Registro histórico de peso corporal
- ✅ **Historial de composición**: Seguimiento de porcentaje de grasa a lo largo del tiempo

### 6.3 Notas Rápidas
- ✅ **Sistema de notas**: Añadir notas rápidas personales
- ✅ **Límite de caracteres**: Máximo 200 caracteres por nota
- ✅ **Gestión**: Añadir, editar y eliminar notas
- ✅ **Visualización**: Lista de todas las notas guardadas

### 6.4 Estadísticas del Perfil
- ✅ **Racha actual**: Días consecutivos entrenando
- ✅ **Meta semanal**: Progreso hacia el objetivo semanal
- ✅ **Logros desbloqueados**: Lista de logros alcanzados
- ✅ **Nivel actual**: Nivel y progreso hacia el siguiente

---

## 🎨 7. PERSONALIZACIÓN

### 7.1 Temas
- ✅ **Modo oscuro**: Tema oscuro completo
- ✅ **Modo claro**: Tema claro completo
- ✅ **Toggle rápido**: Botón para cambiar entre temas
- ✅ **Persistencia**: El tema seleccionado se guarda automáticamente
- ✅ **Transiciones suaves**: Cambios de tema con animaciones fluidas

### 7.2 Colores Personalizados
- ✅ **Selector de colores**: Sistema completo para personalizar colores
- ✅ **Temas independientes**: Colores diferentes para modo oscuro y claro
- ✅ **Paletas predefinidas**: Múltiples paletas de colores disponibles
- ✅ **Aplicación inmediata**: Los cambios se aplican instantáneamente
- ✅ **Persistencia**: Las preferencias de color se guardan

### 7.3 Diseño Responsive
- ✅ **Optimizado para móvil**: Interfaz completamente adaptada a móviles
- ✅ **Optimizado para escritorio**: Experiencia completa en pantallas grandes
- ✅ **Breakpoints inteligentes**: Adaptación automática según tamaño de pantalla
- ✅ **Navegación inferior**: Barra de navegación en móvil
- ✅ **Navegación superior**: Tabs en escritorio

### 7.4 Animaciones y Microinteracciones
- ✅ **Animación "Diagonal"**: Entrada elegante de elementos desde esquinas
- ✅ **Fade y escala**: Transiciones suaves en elementos
- ✅ **Feedback táctil**: Respuestas visuales al tocar botones
- ✅ **Transiciones fluidas**: Animaciones entre pantallas
- ✅ **Botones con transparencia**: Diseño elegante manteniendo legibilidad

---

## 📥 8. IMPORTAR/EXPORTAR

### 8.1 Exportación
- ✅ **Exportar sesiones**: Descargar todas las sesiones en formato JSON
- ✅ **Exportar rutinas**: Descargar todas las rutinas en formato JSON
- ✅ **Nombres con fecha**: Los archivos incluyen fecha de exportación
- ✅ **Formato JSON**: Estructura JSON limpia y legible

### 8.2 Importación
- ✅ **Importar sesiones**: Cargar sesiones desde archivos JSON
- ✅ **Importar rutinas**: Cargar rutinas desde archivos JSON
- ✅ **Validación completa**: Verificación de estructura y datos
- ✅ **Vista previa**: Visualización antes de confirmar importación
- ✅ **Mensajes de error**: Información detallada de problemas
- ✅ **Selección de semana**: Elegir semana objetivo para importar
- ✅ **Preservación de fechas**: Las fechas originales se mantienen si existen

### 8.3 Plantillas Rápidas
- ✅ **Importación directa**: Plantillas que se importan automáticamente
- ✅ **Semana visible**: Se importan en la semana actual
- ✅ **Múltiples opciones**: 3, 4, 5 días y PPL disponibles

---

## ⚡ 9. RENDIMIENTO Y OPTIMIZACIÓN

### 9.1 Arquitectura de Rendimiento Extremo
- ✅ **Event Delegation Global**: Un solo listener para todos los inputs
- ✅ **Renderizado Incremental**: Solo estructura inicial, cálculos diferidos
- ✅ **Batch DOM Updates**: Agrupación de actualizaciones DOM
- ✅ **Lazy Loading**: Carga de ejercicios solo cuando se abre la sesión
- ✅ **Memoización Agresiva**: Cachés para cálculos costosos
- ✅ **Micro-batches**: Procesamiento de cálculos en lotes pequeños (1 set a la vez)
- ✅ **Placeholders**: Indicadores visuales mientras se calculan valores

### 9.2 Optimizaciones Específicas
- ✅ **Sin re-renders completos**: Solo se actualiza lo que cambia
- ✅ **Caché de elementos DOM**: Referencias rápidas a elementos
- ✅ **Cálculos diferidos**: Progress y 1RM se calculan en segundo plano
- ✅ **Minimización de reflows**: Uso de DocumentFragment y batch updates
- ✅ **Optimización para móviles**: Rendimiento fluido incluso en dispositivos de baja potencia

---

## 🔒 10. ALMACENAMIENTO Y PERSISTENCIA

### 10.1 Almacenamiento Local
- ✅ **localStorage**: Todos los datos se guardan localmente en el navegador
- ✅ **Guardado automático**: Los cambios se guardan automáticamente
- ✅ **Debouncing**: Guardado optimizado para evitar escrituras excesivas
- ✅ **Persistencia de preferencias**: Tema, colores y configuraciones se mantienen

### 10.2 Estructura de Datos
- ✅ **Sesiones**: Estructura completa de sesiones con ejercicios y sets
- ✅ **Rutinas**: Rutinas personalizadas con días y ejercicios
- ✅ **Perfil**: Información personal y preferencias
- ✅ **Objetivos**: Metas y progreso
- ✅ **Logros**: Sistema de logros desbloqueados
- ✅ **Notas**: Notas de ejercicios y notas rápidas

---

## 🎓 11. ACCESIBILIDAD Y UX

### 11.1 Accesibilidad
- ✅ **ARIA labels**: Etiquetas ARIA para lectores de pantalla
- ✅ **Navegación por teclado**: Soporte completo de teclado
- ✅ **Roles semánticos**: Uso correcto de roles ARIA
- ✅ **Contraste**: Colores con buen contraste en ambos temas

### 11.2 Experiencia de Usuario
- ✅ **Feedback visual**: Respuestas claras a todas las acciones
- ✅ **Confirmaciones**: Diálogos de confirmación para acciones destructivas
- ✅ **Mensajes informativos**: Toasts y mensajes claros
- ✅ **Estados de carga**: Indicadores mientras se procesan datos
- ✅ **Manejo de errores**: Mensajes de error claros y útiles

---

## 📱 12. FUNCIONALIDADES MÓVILES

### 12.1 Optimizaciones Móviles
- ✅ **Vista adaptada**: Interfaz completamente optimizada para móvil
- ✅ **Temporizador flotante**: Ventana centrada en móvil para el temporizador
- ✅ **Navegación inferior**: Barra de navegación en la parte inferior
- ✅ **Inputs optimizados**: Teclados numéricos apropiados
- ✅ **Touch feedback**: Respuestas táctiles mejoradas

### 12.2 PWA (Progressive Web App)
- ✅ **Funciona offline**: Una vez cargada, funciona sin conexión
- ✅ **Instalable**: Puede instalarse como app nativa
- ✅ **Responsive**: Adaptación completa a diferentes tamaños de pantalla

---

## 🛠️ 13. TECNOLOGÍAS Y ARQUITECTURA

### 13.1 Stack Tecnológico
- ✅ **JavaScript Vanilla**: Sin frameworks, JavaScript puro ES6+
- ✅ **HTML5 Semántico**: Estructura HTML moderna
- ✅ **CSS3 Avanzado**: Variables CSS, Grid, Flexbox, Animaciones
- ✅ **localStorage API**: Almacenamiento local del navegador
- ✅ **Canvas API**: Para gráficos y visualizaciones
- ✅ **IntersectionObserver**: Para lazy loading (preparado)

### 13.2 Arquitectura
- ✅ **Modular**: Código organizado en secciones lógicas
- ✅ **Event-driven**: Arquitectura basada en eventos
- ✅ **State management**: Gestión de estado centralizada
- ✅ **Performance-first**: Optimizado para rendimiento extremo

---

## 📈 14. MÉTRICAS Y ESTADÍSTICAS

### 14.1 Métricas Calculadas
- ✅ **Volumen total**: Suma de todos los kg × reps
- ✅ **Peso máximo**: Mayor peso levantado por ejercicio
- ✅ **RIR promedio**: Promedio de repeticiones en reserva
- ✅ **1RM estimado**: Cálculo de repetición máxima
- ✅ **Progreso comparativo**: Comparación con sesiones anteriores
- ✅ **Estadísticas por período**: Análisis por semanas/meses

### 14.2 Visualizaciones
- ✅ **Gráficos de líneas**: Progreso a lo largo del tiempo
- ✅ **Barras de progreso**: Progreso hacia objetivos
- ✅ **Indicadores visuales**: Iconos y badges para PRs y logros
- ✅ **KPIs**: Métricas clave en resumen semanal

---

## 🎁 15. FUNCIONALIDADES EXTRAS

### 15.1 Utilidades
- ✅ **Manual de usuario**: Documentación completa integrada
- ✅ **Sistema de ayuda**: Guías y consejos en la aplicación
- ✅ **Validación de datos**: Verificación de entrada de datos
- ✅ **Escape de HTML**: Seguridad contra XSS
- ✅ **Formateo de fechas**: Fechas en formato local

### 15.2 Características Especiales
- ✅ **Copia de seguridad**: Exportación como backup
- ✅ **Restauración**: Importación para restaurar datos
- ✅ **Multi-semana**: Navegación entre múltiples semanas
- ✅ **Búsqueda visual**: Encontrar datos rápidamente
- ✅ **Organización inteligente**: Sesiones ordenadas automáticamente

---

## 🎯 CONCLUSIÓN

TrainTracker es una aplicación **completa, avanzada y altamente optimizada** para el seguimiento de entrenamientos de fuerza. Con más de **100 funcionalidades** implementadas, ofrece una experiencia de usuario excepcional tanto en móvil como en escritorio, con un enfoque especial en rendimiento y usabilidad.

La aplicación combina:
- 📝 **Registro detallado** de entrenamientos
- 📊 **Análisis avanzado** de progreso
- 🎯 **Sistema de objetivos** completo
- 🏆 **Gamificación** para motivación
- 🧩 **Gestión de rutinas** flexible
- 🎨 **Personalización** completa
- ⚡ **Rendimiento extremo** incluso en dispositivos de baja potencia

**Total de funcionalidades documentadas: 150+**

---

*Documento generado automáticamente - TrainTracker v1.0*

