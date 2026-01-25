# 📖 Guía para Editar Contenido de Lumen Creativo

Esta guía te ayudará a modificar el contenido de la landing page sin necesidad de saber programar. Solo necesitas abrir los archivos correctos y cambiar el texto entre comillas.

---

## 1️⃣ Cómo Cambiar las Imágenes del Hero (Carousel)

### Archivo a editar:
```
📁 components/sections/Hero.tsx
```

### Qué buscar (líneas 9-26):
```javascript
const heroImages = [
    {
        src: "https://images.unsplash.com/photo-...", // ← CAMBIAR ESTA URL
        alt: "Iglesia moderna con vitral",            // ← CAMBIAR ESTA DESCRIPCIÓN
    },
    {
        src: "https://images.unsplash.com/photo-...", // ← CAMBIAR ESTA URL
        alt: "Diseño gráfico profesional",
    },
    // ... más imágenes
];
```

### Pasos:
1. **Sube tus imágenes** a un servicio como:
   - [Cloudinary](https://cloudinary.com) (gratuito)
   - [ImgBB](https://imgbb.com) (gratuito)
   - O a tu propio hosting

2. **Copia la URL** de cada imagen subida

3. **Reemplaza** la URL de Unsplash por tu URL:
   ```javascript
   src: "https://tu-hosting.com/tu-imagen.jpg",
   ```

4. **Cambia el "alt"** por una descripción de tu imagen (esto ayuda al SEO)

5. **Guarda el archivo** (Ctrl + S)

### Ejemplo real:
```javascript
const heroImages = [
    {
        src: "https://res.cloudinary.com/lumen/fundacion-san-jose.jpg",
        alt: "Redes sociales de Fundación San José",
    },
    {
        src: "https://res.cloudinary.com/lumen/colegio-catolico.jpg",
        alt: "Identidad visual de Colegio San Agustín",
    },
];
```

---

## 2️⃣ Cómo Cambiar el Testimonio

### Archivo a editar:
```
📁 components/sections/CaseStudies.tsx
```

### Qué buscar (líneas 31-36):
```javascript
const testimonial = {
    quote: "Lumen nos ayudó a comunicar...",  // ← CAMBIAR ESTE TEXTO
    author: "Hna. María del Carmen",           // ← CAMBIAR ESTE NOMBRE
    role: "Congregación Santa María",          // ← CAMBIAR ESTA INSTITUCIÓN
    image: "https://images.unsplash.com/...",  // ← CAMBIAR ESTA FOTO
};
```

### Pasos:
1. **Obtén el testimonio** de un cliente real (pídele permiso)

2. **Sube la foto** del cliente a Cloudinary o ImgBB

3. **Edita cada campo**:
   - `quote`: El texto del testimonio entre comillas
   - `author`: Nombre de la persona
   - `role`: Su cargo e institución
   - `image`: URL de su foto

4. **Guarda el archivo**

### Ejemplo real:
```javascript
const testimonial = {
    quote: "Gracias a Lumen, nuestra presencia en redes sociales refleja verdaderamente nuestra misión evangelizadora. Han entendido nuestro carisma desde el primer día.",
    author: "Sor Ana María",
    role: "Directora de Comunicaciones - Congregación de las Hermanas de la Caridad",
    image: "https://res.cloudinary.com/lumen/sor-ana-maria.jpg",
};
```

---

## 3️⃣ Cómo Cambiar los Casos de Estudio

### Archivo a editar:
```
📁 components/sections/CaseStudies.tsx
```

### Qué buscar (líneas 7-29):
```javascript
const caseStudies = [
    {
        image: "https://...",           // ← URL de imagen del proyecto
        client: "Congregación Religiosa", // ← Nombre del cliente
        problem: "Redes desactualizadas...", // ← El problema que tenían
        solution: "Identidad visual...",     // ← Lo que hiciste
        result: "+40% engagement...",        // ← Resultado medible
    },
    // ... más casos
];
```

### Consejo:
Usa resultados REALES y medibles. Ejemplos:
- "+50 nuevos seguidores en 1 mes"
- "3 familias nuevas contactaron por Instagram"
- "Duplicaron las visitas a su web"

---

## 📝 Resumen Rápido

| Qué cambiar | Archivo | Qué buscar |
|-------------|---------|------------|
| Imágenes del carousel | `components/sections/Hero.tsx` | `heroImages = [` |
| Testimonio | `components/sections/CaseStudies.tsx` | `testimonial = {` |
| Casos de estudio | `components/sections/CaseStudies.tsx` | `caseStudies = [` |

---

## ⚠️ Tips Importantes

1. **NO borres las comillas** - El texto siempre va entre `"comillas"`
2. **NO borres las comas** - Cada elemento termina con `,`
3. **Guarda siempre** con Ctrl + S antes de cerrar
4. **Revisa en el navegador** - La página se actualiza automáticamente
5. **Si algo se rompe** - Presiona Ctrl + Z para deshacer

---

## 🆘 Si Algo Sale Mal

Si aparece un error en la pantalla:
1. Revisa que no hayas borrado comillas, comas o llaves
2. Compara con el código original
3. Puedes usar Ctrl + Z varias veces para volver atrás
