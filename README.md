# Proyecto: Rosario3 · Experiencia Scrollytelling sobre Nuevas Reglas para Navegar

## 1. Concepto editorial

El concepto principal de esta experiencia es convertir una noticia puramente informativa sobre normativas en una experiencia de usuario interactiva y exploratoria. En lugar de enfrentar al lector con un muro de texto jurídico o reglamentario, le ofrecemos la posibilidad de "recorrer" la nueva normativa utilizando un hilo conductor visual: una embarcación en un río.

La intención es que el usuario experimente la noticia espacial y temporalmente, donde el scroll funciona como el tiempo y las animaciones/cambios visuales funcionan como la nueva información ingresando a la escena.

## 2. Estructura narrativa

La estructura está diseñada para llevar al lector de lo macro a lo micro, y luego a un resumen.
El scrollytelling se divide en 10 escenas/pasos clave (0 al 9), controlados a través del scroll del usuario. A medida que el usuario avanza por las tarjetas de texto, un `IntersectionObserver` detecta qué tarjeta está activa y actualiza un atributo `data-scenestate` en el `body`, lo que dispara transiciones CSS en la capa visual subyacente.

## 3. Qué representa cada escena

*   **Escena 0 - Introducción:** La portada de la nota. Introduce al protagonista (la embarcación) de forma sutil flotando en el agua e invita al usuario a "Deslizar para navegar".
*   **Escena 1 - El Cambio:** Representa la evolución normativa (Ordenanza 9-02 a 1-26). Una transición tipográfica marca que algo viejo quedó atrás y fue reemplazado.
*   **Escena 2 - Alcance:** Aparecen etiquetas sobre la embarcación, mostrando de manera clara qué elementos están contemplados en la ley (Lanchas, Motos de agua, Motores).
*   **Escena 3 - El Motor:** El foco ("zoom") se dirige hacia la parte trasera de la embarcación para introducir el concepto del motor.
*   **Escena 4 - El Umbral de 85 kW:** Un momento de alta interacción. Permite al usuario "sentir" el cambio de la regla al deslizar un rango de potencia.
*   **Escena 5 - Embarcación Nueva:** Presenta los requisitos como un checklist elegante que va apareciendo progresivamente.
*   **Escena 6 - Matrícula:** Una representación abstracta de un bloqueo (prohibición automática) que se abre o disuelve, ilustrando que el castigo inmediato por falta de pago fue removido.
*   **Escena 7 - Importación / Exportación:** Un concepto de bifurcación, dando a entender que hay "dos caminos" posibles (ARCA o Declaración jurada).
*   **Escena 8 - Régimen Simplificado:** Aparecen nuevos actores institucionales (Organización Reconocida / Consejo Profesional).
*   **Escena 9 - Resumen:** La embarcación desaparece, el agua inunda la escena limpiándola y se presenta un resumen de 5 puntos clave.

## 4. Qué interacciones existen

1.  **Scroll como conductor principal:** Todo el avance de la narrativa se controla simplemente desplazándose hacia abajo.
2.  **Slider de Potencia (Escena 4):** El usuario puede interactuar con un `<input type="range">` para cambiar la potencia del motor (en kW). Al cruzar el umbral de los 85 kW, la etiqueta visual y el texto cambian abruptamente de color y estado, reforzando la regla de "obligatoriedad".
3.  **Botones de Decisión (Escena 7):** El usuario puede clickear en dos botones (Certificado ARCA / Declaración jurada) para leer brevemente de qué trata cada camino.

## 5. Qué información proviene de la nota

Toda la información fue extraída del texto original publicado en Rosario3:
*   El reemplazo de la Ordenanza 9-02 por la 1-26 (y la Disposición 1053/2026).
*   Los tipos de embarcaciones (lanchas, motos de agua, artefactos navales con arqueo bruto inferior a 3).
*   El límite exacto de 85 kW para inscripción obligatoria vs optativa.
*   Los requisitos para embarcaciones nuevas (condiciones de navegabilidad, conductor habilitante, declaración jurada).
*   La eliminación de la prohibición automática de navegar por deuda de Tasa Fija Anual.
*   Las dos opciones de documentación para importación/exportación.
*   La posibilidad de intervención de Organizaciones Reconocidas o el Consejo Profesional de Ingeniería Naval.

## 6. Qué partes podrían convertirse en componentes reutilizables

*   **El contenedor de Scrollytelling (`#scrolly`, `.sticky-visual`, `.scroll-text`):** El sistema HTML y el script JS con el `IntersectionObserver` pueden aislarse como un componente base genérico para cualquier nota de Rosario3 que requiera scrollytelling, independiente del gráfico.
*   **Slider de Impacto (Escena 4):** El componente de slider que cambia un estado (por ej. inflación, precios, multas) basado en un umbral.
*   **Decisor / Caminos (Escena 7):** Un componente de botones "A / B" que revela información secundaria sin recargar la página.

## 7. Estado del prototipo

El proyecto se encuentra en un estado funcional avanzado como prototipo front-end:
*   **HTML/CSS/JS puros:** No requiere empaquetadores ni dependencias externas pesadas, asegurando tiempos de carga rápidos.
*   **Mobile-first y Responsivo:** Las tarjetas de texto y el `sticky-visual` se adaptan a resoluciones móviles y de escritorio.
*   **Accesible:** Usa tamaños de texto adecuados, altos contrastes y no depende exclusivamente de los colores para transmitir significado. El control del slider se realiza nativamente.

Para producción, los gráficos SVG incrustados en HTML podrían externalizarse o generarse dinámicamente según se precise, y se pueden ajustar finamente los colores de la marca de Rosario3.
