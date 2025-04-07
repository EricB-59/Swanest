import {
  Component,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import interact from 'interactjs';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styles: `
    .ease-pop {
      --tw-ease: cubic-bezier(0.16, 2, 0.68, 0.96);
      transition-timing-function: cubic-bezier(0.16, 2, 0.68, 0.96);
    }
  `,
})
export class LandingComponent implements AfterViewInit {
  @ViewChildren('menuText') menuTexts!: QueryList<ElementRef>;
  @ViewChild('draggableImage') draggableImage!: ElementRef;
  @ViewChildren('animatedButton') buttonElements!: QueryList<ElementRef>;

  ngAfterViewInit() {
    // Esperamos a que la vista se inicialice completamente
    setTimeout(() => {
      this.initializeHoverEffects();
      this.initializeDraggableImage();

      // Inicializar los botones dentro del mismo setTimeout
      // para asegurar que el DOM esté listo
      this.buttonElements.forEach((buttonRef) => {
        new Button(buttonRef.nativeElement);
      });
    }, 0);
  }

  initializeDraggableImage() {
    // https://codepen.io/Vincent_mgd/pen/BaMrodL
    if (!this.draggableImage) return;

    // Obtener la sección padre para la restricción
    const parentSection = this.draggableImage.nativeElement.closest('section');

    interact(this.draggableImage.nativeElement).draggable({
      // Habilitar inercia para el efecto de "lanzamiento"
      inertia: {
        resistance: 5,
        endSpeed: 5,
        allowResume: true,
        smoothEndDuration: 300,
      },

      // Mantener el elemento dentro de la sección padre
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: parentSection,
          endOnly: true, // Aplicar la restricción solo al final para permitir el "rebote"
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
        }),
      ],

      listeners: {
        start: (event) => {
          // Cambia el cursor a "grabbing" durante el arrastre
          event.target.style.cursor = 'grabbing';
        },

        move: this.dragMoveListener,

        end: (event) => {
          // Restaurar el cursor original
          event.target.style.cursor = 'grab';
        },
      },
    });
  }

  dragMoveListener(event: any) {
    const target = event.target;

    // Obtener la posición actual o iniciar en 0
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // Obtener la rotación actual (si existe en el estilo o usar la del CSS)
    const currentTransform = window.getComputedStyle(target).transform;
    let rotation = '';

    // Extraer la rotación actual si existe
    if (currentTransform && currentTransform !== 'none') {
      const transformValues = target.style.transform.match(/rotate\([^)]+\)/);
      if (transformValues && transformValues.length > 0) {
        rotation = transformValues[0];
      }
    }

    // Aplicar transformación manteniendo la rotación
    if (rotation) {
      target.style.transform = `translate(${x}px, ${y}px) ${rotation}`;
    } else {
      target.style.transform = `translate(${x}px, ${y}px)`;
    }

    // Actualizar los atributos de posición
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  initializeHoverEffects() {
    // Obtenemos todos los elementos li (padres de los spans)
    const menuItems = this.menuTexts.map(
      (item) => item.nativeElement.parentElement,
    );

    // Aplicamos el efecto a cada elemento del menú
    menuItems.forEach((item, index) => {
      const span = this.menuTexts.get(index)?.nativeElement;
      if (span) {
        // Aseguramos el estado inicial
        gsap.set(span, { color: 'rgba(255, 255, 255, 0.5)' });

        // Configuramos el borde inicial
        gsap.set(item, {
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: '1px',
          borderStyle: 'solid',
        });

        // Variables para controlar el estado
        let isHovered = false;

        // Creamos una única timeline para manejar todas las animaciones
        const tl = gsap.timeline({ paused: true });

        // Configuración para mouseenter
        const enterAnimation = () => {
          // Reseteamos la timeline
          tl.clear();

          // Animamos el borde al mismo tiempo que el texto
          tl.to(
            item,
            {
              duration: 0.17, // Reducida de 0.4 a 0.3
              borderColor: 'rgba(255, 255, 255, 1)',
              ease: 'power2.out',
            },
            0,
          );

          // Primera parte de la animación - texto hacia arriba
          tl.to(
            span,
            {
              duration: 0.1, // Reducida de 0.2 a 0.1
              yPercent: -150,
              ease: 'power2.in',
            },
            0,
          );

          // Reposicionamos el texto abajo sin animación
          tl.set(span, {
            yPercent: 150,
            color: 'white',
          });

          // Finalizamos con el texto volviendo a su posición original
          tl.to(span, {
            duration: 0.1, // Reducida de 0.2 a 0.1
            yPercent: 0,
          });

          // Reproducimos la animación
          tl.play(0);
        };

        // Configuración para mouseleave
        const leaveAnimation = () => {
          // Reseteamos la timeline
          tl.clear();

          // Animamos el borde de vuelta a su estado original
          tl.to(
            item,
            {
              duration: 0.3, // Reducida de 0.4 a 0.3
              borderColor: 'rgba(255, 255, 255, 0.5)',
              ease: 'power2.out',
            },
            0,
          );

          // Primera parte de la animación - texto hacia abajo
          tl.to(
            span,
            {
              duration: 0.1, // Reducida de 0.2 a 0.1
              yPercent: 150,
              ease: 'power2.in',
            },
            0,
          );

          // Reposicionamos el texto arriba sin animación
          tl.set(span, {
            yPercent: -150,
            color: 'rgba(255, 255, 255, 0.5)',
          });

          // Finalizamos con el texto volviendo a su posición original
          tl.to(span, {
            duration: 0.1, // Reducida de 0.2 a 0.1
            yPercent: 0,
          });

          // Reproducimos la animación
          tl.play(0);
        };

        // Añadimos los event listeners para hover
        item.addEventListener('mouseenter', () => {
          isHovered = true;
          enterAnimation();
        });

        // Event listener para cuando el mouse sale
        item.addEventListener('mouseleave', () => {
          isHovered = false;
          leaveAnimation();
        });
      }
    });
  }
}

class Button {
  private DOM: {
    button: HTMLElement;
    flair: HTMLElement;
  } = {} as any;

  private xSet!: ReturnType<typeof gsap.quickSetter>;
  private ySet!: ReturnType<typeof gsap.quickSetter>;

  constructor(buttonElement: HTMLElement) {
    this.init(buttonElement);
    this.initEvents();
  }

  private init(buttonElement: HTMLElement) {
    this.DOM = {
      button: buttonElement,
      flair: buttonElement.querySelector('.button__flair') as HTMLElement,
    };

    // Establecer transformOrigin inicial
    gsap.set(this.DOM.flair, {
      transformOrigin: '0% 0%',
    });

    this.xSet = gsap.quickSetter(this.DOM.flair, 'xPercent');
    this.ySet = gsap.quickSetter(this.DOM.flair, 'yPercent');
  }

  private getXY(e: MouseEvent) {
    const { left, top, width, height } =
      this.DOM.button.getBoundingClientRect();

    const xTransformer = gsap.utils.pipe(
      gsap.utils.mapRange(0, width, 0, 100),
      gsap.utils.clamp(0, 100),
    );

    const yTransformer = gsap.utils.pipe(
      gsap.utils.mapRange(0, height, 0, 100),
      gsap.utils.clamp(0, 100),
    );

    const x = xTransformer(e.clientX - left);
    const y = yTransformer(e.clientY - top);

    return { x, y };
  }

  private getExitCoordinates(e: MouseEvent) {
    const { left, top, right, bottom, width, height } =
      this.DOM.button.getBoundingClientRect();

    // Calcular la posición del cursor relativa al botón
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Determinar el borde más cercano
    const distToLeft = mouseX;
    const distToRight = width - mouseX;
    const distToTop = mouseY;
    const distToBottom = height - mouseY;

    const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

    // Calcular posiciones en porcentaje para xPercent/yPercent
    let xPercent = (mouseX / width) * 100;
    let yPercent = (mouseY / height) * 100;

    // Ajustar basándose en el borde más cercano
    // En este caso, conservamos la coordenada en el eje donde NO está el borde más cercano
    // y proyectamos la otra coordenada más allá del borde
    if (minDist === distToLeft) {
      // Salir por la izquierda - mantener la Y, proyectar X hacia la izquierda
      xPercent = -20;
    } else if (minDist === distToRight) {
      // Salir por la derecha - mantener la Y, proyectar X hacia la derecha
      xPercent = 120;
    } else if (minDist === distToTop) {
      // Salir por arriba - mantener la X, proyectar Y hacia arriba
      yPercent = -20;
    } else if (minDist === distToBottom) {
      // Salir por abajo - mantener la X, proyectar Y hacia abajo
      yPercent = 120;
    }

    return { xPercent, yPercent };
  }

  private initEvents() {
    this.DOM.button.addEventListener('mouseenter', (e) => {
      const { x, y } = this.getXY(e as MouseEvent);

      // Posicionar la burbuja donde entra el cursor
      this.xSet(x);
      this.ySet(y);

      // Actualizar el origen de transformación
      gsap.set(this.DOM.flair, {
        transformOrigin: `${x}% ${y}%`,
      });

      gsap.to(this.DOM.flair, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    this.DOM.button.addEventListener('mouseleave', (e) => {
      const mouseEvent = e as MouseEvent;

      // Obtener la posición exacta por donde sale el cursor
      const { x, y } = this.getXY(mouseEvent);
      const exitCoords = this.getExitCoordinates(mouseEvent);

      // Actualizar el origen de transformación a la posición actual
      gsap.set(this.DOM.flair, {
        transformOrigin: `${x}% ${y}%`,
      });

      gsap.killTweensOf(this.DOM.flair);

      // Animación de salida que sigue al cursor
      gsap.to(this.DOM.flair, {
        xPercent: exitCoords.xPercent,
        yPercent: exitCoords.yPercent,
        scale: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    this.DOM.button.addEventListener('mousemove', (e) => {
      const { x, y } = this.getXY(e as MouseEvent);

      // Actualizar la posición de la burbuja para seguir al cursor
      gsap.to(this.DOM.flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
  }
}
