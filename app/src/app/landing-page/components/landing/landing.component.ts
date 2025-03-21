import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styles: ``
})
export class LandingComponent implements AfterViewInit {
  // Usamos ViewChildren para obtener referencias a todos los elementos span
  @ViewChildren('menuText') menuTexts!: QueryList<ElementRef>;

  ngAfterViewInit() {
    // Esperamos a que la vista se inicialice completamente
    setTimeout(() => {
      this.initializeHoverEffects();
    }, 0);
  }

  initializeHoverEffects() {
    // Obtenemos todos los elementos li (padres de los spans)
    const menuItems = this.menuTexts.map(item => item.nativeElement.parentElement);
    
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
          borderStyle: 'solid'
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
          tl.to(item, {
            duration: 0.17, // Reducida de 0.4 a 0.3
            borderColor: 'rgba(255, 255, 255, 1)',
            ease: "power2.out"
          }, 0);
          
          // Primera parte de la animación - texto hacia arriba
          tl.to(span, { 
            duration: 0.1, // Reducida de 0.2 a 0.1
            yPercent: -150, 
            ease: "power2.in" 
          }, 0);
          
          // Reposicionamos el texto abajo sin animación
          tl.set(span, { 
            yPercent: 150,
            color: 'white'
          });
          
          // Finalizamos con el texto volviendo a su posición original
          tl.to(span, { 
            duration: 0.1, // Reducida de 0.2 a 0.1
            yPercent: 0
          });
          
          // Reproducimos la animación
          tl.play(0);
        };
        
        // Configuración para mouseleave
        const leaveAnimation = () => {
          // Reseteamos la timeline
          tl.clear();
          
          // Animamos el borde de vuelta a su estado original
          tl.to(item, {
            duration: 0.3, // Reducida de 0.4 a 0.3
            borderColor: 'rgba(255, 255, 255, 0.5)',
            ease: "power2.out"
          }, 0);
          
          // Primera parte de la animación - texto hacia abajo
          tl.to(span, { 
            duration: 0.1, // Reducida de 0.2 a 0.1
            yPercent: 150, 
            ease: "power2.in" 
          }, 0);
          
          // Reposicionamos el texto arriba sin animación
          tl.set(span, { 
            yPercent: -150,
            color: 'rgba(255, 255, 255, 0.5)'
          });
          
          // Finalizamos con el texto volviendo a su posición original
          tl.to(span, { 
            duration: 0.1, // Reducida de 0.2 a 0.1
            yPercent: 0
          });
          
          // Reproducimos la animación
          tl.play(0);
        };
        
        // Añadimos los event listeners para hover
        item.addEventListener("mouseenter", () => {
          isHovered = true;
          enterAnimation();
        });
        
        // Event listener para cuando el mouse sale
        item.addEventListener("mouseleave", () => {
          isHovered = false;
          leaveAnimation();
        });
      }
    });
  }
}
