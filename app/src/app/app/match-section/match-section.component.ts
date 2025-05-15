import {
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatchService } from '../../services/match/match.service';
import { Profile } from '../../models/profile';
import Swiper from 'swiper';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import { InfoModalComponent } from '../components/info-modal/info-modal.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { FilterModalComponent } from './filter-modal/filter-modal.component';

@Component({
  selector: 'app-match-section',
  imports: [],
  templateUrl: './match-section.component.html',
  styleUrl: './match-section.component.css',
})
export class MatchSectionComponent implements OnInit, OnDestroy {
  matchService: MatchService = inject(MatchService);
  profiles: Profile[] = []; // Aquí guardaremos el primer objeto de cada array
  imagenes: any[] = []; // Aquí guardaremos los objetos restantes
  user = sessionStorage.getItem('user');
  private cardToUserIdMap = new WeakMap<HTMLElement, number>();
  private overlayRef: OverlayRef | null = null;

  constructor(private _matDialog: MatDialog, private overlay: Overlay) {}

  ngOnInit(): void {
    if (this.user) {
      const user_id = JSON.parse(this.user).id;
      this.matchService.getProfiles(user_id).subscribe({
        next: (data) => {
          console.log("PRUEBA - ",data)
          // Procesamos los datos para separar profiles e imagenes
          this.processProfileData(data);

          setTimeout(() => {
            this.initializeSwipers();
            this.initializeCardMapping();
            this.setupDragEvents();
          }, 0);
        },
        error: (error) => {
          console.error(error);
        },
      });
      this.matchService.getMatchCounts(user_id).subscribe({
        next: (data) => {
          const sessionCount = sessionStorage.getItem('count-notification');
          const countSession = sessionCount ? +sessionCount : 0;

          if (countSession !== data && data >= 1) {
            this._matDialog.open(InfoModalComponent, {
              data: { type: 'Matchs', number: data },
              panelClass: 'transparent-modal',
              backdropClass: 'transparent-backdrop',
              hasBackdrop: true,
            });

            // Opcional: actualiza el valor en sessionStorage si deseas que no se vuelva a mostrar hasta que cambie
            sessionStorage.setItem('count-notification', data.toString());
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.user) {
      const user_id = JSON.parse(this.user).id;
      this.matchService.getMatchCounts(user_id).subscribe({
        next: (data) => {
          const sessionCount = sessionStorage.getItem('count-notification');
          const countSession = sessionCount ? +sessionCount : 0;

          if (countSession !== data && data >= 1) {
            this._matDialog.open(InfoModalComponent, {
              data: { type: 'Matchs', number: data },
              panelClass: 'transparent-modal',
              backdropClass: 'transparent-backdrop',
              hasBackdrop: true,
            });

            // Opcional: actualiza el valor en sessionStorage si deseas que no se vuelva a mostrar hasta que cambie
            sessionStorage.setItem('count-notification', data.toString());
          }
        },
        error: (error) => {
          console.error(error);
          this.profiles = [];
          this.imagenes = [];
        },
      });
    }
  }

  openFilterDialog(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;

    const overlayConfig = {
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(target)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 8  // Espacio entre el botón y el modal
        }])
    };

    // Crear el overlay
    this.overlayRef = this.overlay.create(overlayConfig);
    
    // Cerrar cuando se hace clic en el backdrop
    this.overlayRef.backdropClick().subscribe(() => {
      if (this.overlayRef) {
        this.overlayRef.dispose();
        this.overlayRef = null;
      }
    });
    
    // Crear y adjuntar el componente modal
    const modalPortal = new ComponentPortal(FilterModalComponent);
    const modalRef = this.overlayRef.attach(modalPortal);
    
    // Suscribirse al evento de cierre del modal
    modalRef.instance.close.subscribe(() => {
      if (this.overlayRef) {
        this.overlayRef.dispose();
        this.overlayRef = null;
      }
    });

    if (this.user) {
      const user_id = JSON.parse(this.user).id
      modalRef.instance.applyFilters.subscribe(() => {
        this.matchService.getProfiles(user_id).subscribe({
          next: (data) => {
            console.log("PRUEBA - ",data)
            this.processProfileData(data);
            setTimeout(() => {
              this.initializeSwipers();
              this.initializeCardMapping();
              this.setupDragEvents();
            }, 0);
          },
          error: (err) => {
            console.error(err)
            this.profiles = [];
            this.imagenes = [];
          },
          complete: () => {
            // 4) Cierra el modal
            this.overlayRef?.dispose();
            this.overlayRef = null;
          }
        })
        this.overlayRef?.dispose();
        this.overlayRef = null;
      });
    }
  }

  /**
   * Procesa los datos recibidos del backend separando el primer objeto como profile
   * y los demás como imágenes
   */
  private processProfileData(data: any[]): void {
    // Asumimos que data es un array donde cada elemento es otro array
    // El primer elemento de cada subarray es el profile, el resto son imágenes
    this.profiles = [];
    this.imagenes = [];

    data.forEach((item) => {
      if (Array.isArray(item) && item.length > 0) {
        // El primer elemento es el profile
        this.profiles.push(item[0]);

        // Los elementos restantes son imágenes
        if (item.length > 1) {
          this.imagenes.push(item.slice(1));
        }
      } else {
        // Si el elemento no es un array, lo tratamos como un profile completo
        this.profiles.push(item);
      }
    });
  }

  private initializeSwipers(): void {
    const swipers = document.querySelectorAll('.swiper');

    swipers.forEach((swiperEl, index) => {
      new Swiper(swiperEl as HTMLElement, {
        modules: [Autoplay, EffectFade],
        effect: 'fade',
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        on: {
          init: function () {
            const counter = document.querySelector(
              `#counter-${index} span.text-white`,
            );
            if (counter) {
              counter.textContent = String((this as any).realIndex + 1);
            }
          },
          slideChange: function () {
            const counter = document.querySelector(
              `#counter-${index} span.text-white`,
            );
            if (counter) {
              counter.textContent = String((this as any).realIndex + 1);
            }
          },
        },
      });
    });
  }

  handleDislike(profile: Profile, event: Event) {
    event.stopPropagation();

    const card = (event.target as HTMLElement).closest('.card') as HTMLElement;
    if (!card) return;

    card.classList.add('go-left');

    this.addDislike(profile.user_id);

    card.addEventListener(
      'transitionend',
      () => {
        this.profiles = this.profiles.filter(
          (p) => p.user_id !== profile.user_id,
        );
        // También eliminamos las imágenes correspondientes
        const profileIndex = this.profiles.findIndex(
          (p) => p.user_id === profile.user_id,
        );
        if (profileIndex !== -1) {
          this.imagenes.splice(profileIndex, 1);
        }
      },
      { once: true },
    );
  }

  handleLike(profile: Profile, event: Event): void {
    event.stopPropagation();

    const card = (event.target as HTMLElement).closest('.card') as HTMLElement;
    if (!card) return;

    card.classList.add('go-right');

    this.addLike(profile.user_id);

    card.addEventListener(
      'transitionend',
      () => {
        // Obtenemos el índice antes de filtrar
        const profileIndex = this.profiles.findIndex(
          (p) => p.user_id === profile.user_id,
        );

        this.profiles = this.profiles.filter(
          (p) => p.user_id !== profile.user_id,
        );

        // También eliminamos las imágenes correspondientes
        if (profileIndex !== -1) {
          this.imagenes.splice(profileIndex, 1);
        }
      },
      { once: true },
    );
  }

  addLike(likedUserId: number) {
    if (this.user) {
      const user_id = JSON.parse(this.user).id;
      this.matchService.addLike(user_id, likedUserId).subscribe({
        next: (data) => {
          console.info(data);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  addDislike(dislikeUserId: number) {
    if (this.user) {
      const user_id = JSON.parse(this.user).id;
      this.matchService.addDislike(user_id, dislikeUserId).subscribe({
        next: (data) => {
          console.info(data);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  private initializeCardMapping(): void {
    setTimeout(() => {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card, index) => {
        if (this.profiles[index]) {
          this.cardToUserIdMap.set(
            card as HTMLElement,
            this.profiles[index].user_id,
          );
        }
      });
    });
  }

  private setupDragEvents(): void {
    // As of this grades we consider the user maked a decision
    const DECISION_THRESHOLD = 75;

    // flag for don't mix animations
    let isAnimating = false;

    // Distance of the card drag
    let pullDistanceX = 0;
    const component = this;

    document.addEventListener('mousedown', startDrag);
    // With passive true we ignore the default behavior
    document.addEventListener('touchstart', startDrag, { passive: true });

    /**
     * This function is called when the user start to drag with mouse or with touch
     * @param event
     * @returns
     */
    function startDrag(event: any) {
      if (isAnimating) return;

      const target = event.target as HTMLElement;
      // Get the first article
      const actualCard = target.closest('.card') as HTMLElement;
      if (!actualCard) return;

      // Get initial position of mouse or finger
      const startX = event.pageX ?? event.touches[0].pageX;

      // Listen the mouse and touch movements
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);

      document.addEventListener('touchmove', onMove, { passive: true });
      document.addEventListener('touchend', onEnd, { passive: true });

      function onMove(event: any) {
        // current position - safely handle both mouse and touch events
        let currentX;
        if (event.pageX !== undefined) {
          currentX = event.pageX;
        } else if (event.touches && event.touches.length > 0) {
          currentX = event.touches[0].pageX;
        } else {
          currentX = 0; // fallback value
        }

        // the distance between init and current position
        pullDistanceX = currentX - startX;

        // no distance
        if (pullDistanceX === 0) return;

        // change the flag
        isAnimating = true;
        // calculate rotation
        const rotation = pullDistanceX / 40;
        if (actualCard) {
          // apply the transform to the card
          actualCard.style.transform = `translateX(${pullDistanceX}px) rotate(${rotation}deg)`;
          actualCard.style.cursor = 'grabbing';
        }
      }

      function onEnd() {
        // remove the event listeners
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);

        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        // user make a choise?
        const decisionMade = Math.abs(pullDistanceX) >= DECISION_THRESHOLD;

        // In this point the user had make a decision
        if (decisionMade) {
          const goRight = pullDistanceX >= 0;

          // add class acording to the decision
          actualCard?.classList.add(goRight ? 'go-right' : 'go-left');
          actualCard?.addEventListener(
            'transitionend',
            () => {
              const user_id = component.cardToUserIdMap.get(actualCard);
              if (user_id !== undefined) {
                if (goRight) {
                  component.addLike(user_id);
                } else {
                  component.addDislike(user_id);
                }
              }

              // Encontrar y eliminar el profile y sus imágenes
              const profileIndex = component.profiles.findIndex(
                (p) => p.user_id === user_id,
              );
              if (profileIndex !== -1) {
                component.profiles.splice(profileIndex, 1);
                component.imagenes.splice(profileIndex, 1);
              }

              actualCard.remove();
              isAnimating = false;
            },
            { once: true },
          );
        } else {
          actualCard?.classList.add('reset');
          actualCard?.classList.remove('go-right', 'go-left');
        }

        // reset the variables
        actualCard?.addEventListener('transitionend', () => {
          actualCard.removeAttribute('style');
          actualCard.classList.remove('reset');
        });

        pullDistanceX = 0;
        isAnimating = false;
        if (actualCard) {
          // apply the transform to the card
          actualCard.style.transform = `translateX(${pullDistanceX}px) rotate(0deg)`;
          actualCard.style.cursor = 'grabbing';
        }
      }
    }
  }

  calcularEdad(fechaNacimiento: string): number {
    // Crear objeto Date a partir de la fecha de nacimiento
    const fechaNac = new Date(fechaNacimiento);

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Calcular la diferencia de años
    let edad = fechaActual.getFullYear() - fechaNac.getFullYear();

    // Ajustar la edad si aún no ha cumplido años en el año actual
    const mesActual = fechaActual.getMonth();
    const diaActual = fechaActual.getDate();
    const mesNacimiento = fechaNac.getMonth();
    const diaNacimiento = fechaNac.getDate();

    if (
      mesActual < mesNacimiento ||
      (mesActual === mesNacimiento && diaActual < diaNacimiento)
    ) {
      edad--;
    }

    return edad;
  }
}
