# Identidad visual pública de LUDIER

La portada es la referencia visual para los nuevos bloques y páginas. Mantener
su lenguaje industrial: fondos grafito y papel, fotografía real de obras,
bordes discretos, esquinas técnicas y naranja como acento.

## Tipografía

- Inter para títulos, texto y botones. Se carga una sola vez con `next/font`
  en `app/layout.tsx` y se expone como `--font-inter`.
- `--font-body` y `--font-display` resuelven a esa misma fuente dentro de
  `.ludier-public`. No añadir otra familia a una landing aislada.
- Monoespaciada del sistema para códigos y etiquetas técnicas; evitarla en
  descripciones y botones comerciales.

## Paleta

Las variables de `.ludier-public` en `app/globals.css` son la referencia:

| Uso | Color |
| --- | --- |
| Naranja de marca, botones y detalles | `#FF5A1F` |
| Naranja al pasar el cursor | `#FF7A44` |
| Naranja para enlaces sobre fondo claro | `#B8390F` |
| Fondo oscuro | `#14161A` |
| Fondo papel | `#F7F7F4` |
| Tarjetas | `#FFFFFF` |
| Títulos sobre fondo claro | `#1E2126` |
| Texto sobre fondo claro | `#565C63` |
| Bordes sobre fondo claro | `#E3E1D8` |

## Componentes compartidos

- Usar `ServicioCard` en la portada y el catálogo. Mantener iguales imagen,
  iconos, tamaño de título, etiquetas, altura de acciones y estados de foco.
- Usar `ConstructorasCTA` para destacar la atención a constructoras.
- Botón principal: `ludier-button ludier-button-primary`.
- Botón secundario: `ludier-button ludier-button-secondary`; añadir
  `ludier-button-secondary-dark` sobre fondos oscuros.
- Conservar bordes finos, radios discretos y animaciones suaves que respeten
  la preferencia de movimiento reducido.

Comprobar escritorio y móvil con la fuente cargada, sin desbordamiento
horizontal, imágenes rotas ni controles superpuestos. Las reglas del tema
público se aplican dentro de `.ludier-public`.

## Interacción y movimiento

- En servicios, «Soy constructora» abre la página de atención a constructoras.
  «Explorar servicios» desplaza al catálogo; son acciones distintas.
- Usar `Reveal` para entradas al entrar en pantalla. El contenido debe seguir
  visible sin JavaScript y con movimiento reducido.
- La muestra de obras usa controles manuales, transiciones entre fotos reales
  y enlaces a los proyectos. Evitar cambios automáticos que interrumpan la lectura.
- Reservar los efectos de luz, acercamiento y elevación para las interacciones;
  mantenerlos en la paleta original y desactivarlos con movimiento reducido.
