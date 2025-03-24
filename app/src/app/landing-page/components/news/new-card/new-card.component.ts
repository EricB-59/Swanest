import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-new-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      class="relative w-[90rem] h-[30rem] flex justify-center flex-col overflow-hidden rounded-4xl"
    >
      @for (new of news; track $index) {
        <article
          class="absolute top-0 left-0 w-full h-full grid grid-cols-2 bg-black carousel-card"
          [ngStyle]="{ '--index': $index }"
        >
          <div class="flex flex-col justify-between h-full p-8">
            <div>
              <h2 class="text-white text-6xl font-basebold mb-4">
                {{ new.title }}
              </h2>
              <p class="text-white font-basereg text-3xl">{{ new.text }}</p>
            </div>
            <span class="text-red-600 text-2xl">{{ new.date }}</span>
          </div>
          <div class="h-full flex items-center justify-end p-8">
            <img
              src="{{ 'news-img/' + new.img }}"
              alt="Picture of the new"
              class="h-auto object-contain rounded-4xl w-[35rem]"
            />
          </div>
        </article>
      }
    </section>
  `,
  styles: [
    `
      @keyframes carouselVertical {
        0%,
        5% {
          transform: translateY(100%) scale(0.7);
          opacity: 0.4;
          visibility: visible;
        }

        25%,
        45% {
          transform: translateY(0) scale(1);
          opacity: 1;
          visibility: visible;
        }

        65%,
        85% {
          transform: translateY(-100%) scale(0.7);
          opacity: 0.4;
          visibility: visible;
        }

        95%,
        100% {
          transform: translateY(-200%) scale(0.5);
          opacity: 0;
          visibility: hidden;
        }
      }

      .carousel-card {
        border-radius: 1rem;
        animation: carouselVertical 10s linear infinite;
        animation-delay: calc(var(--index) * 3s);
      }
    `,
  ],
})
export class NewCardComponent {
  news = [
    {
      title: 'ENVIO DE REGALOS',
      text: 'Al igual que los cisnes, las personas buscamos con quien formar nuestro nido y vivir experiencias juntos.',
      date: '22/02/2025',
      img: 'new-gifts.png',
    },
    {
      title: 'NUEVO EVENTO',
      text: 'Descubre los encuentros exclusivos para nuestros usuarios premium.',
      date: '10/03/2025',
      img: 'event.svg',
    },
    {
      title: 'MATCH PERFECTO',
      text: 'Ahora es más fácil encontrar personas con intereses en común gracias a nuestra IA.',
      date: '05/04/2025',
      img: 'match.svg',
    },
  ];
}
