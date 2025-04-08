import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-match-section',
  imports: [],
  template: `
    <section>
      <div class="cards relative w-60">
        <article class="absolute top-0 cursor-grab">
          <img src="assets/images/test-match.png" alt="error" />
          <h2 class="absolute bottom-10 text-white">
            Guillem<span class="text-white">21</span>
          </h2>
        </article>
        <article class="absolute top-0 cursor-grab">
          <img src="assets/images/test-match.png" alt="error" />
          <h2 class="absolute bottom-10 text-white">
            Joel<span class="text-white">21</span>
          </h2>
        </article>
      </div>
      <div class="buttons">
        <button class="like"></button>
        <button class="dislike"></button>
      </div>
    </section>
  `,
  styleUrl: './match-section.component.css',
})
export class MatchSectionComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // As of this grades we consider the user maked a decision
    const DECISION_THRESHOLD = 75;

    // flag for don't mix animations
    let isAnimating = false;

    // Distance of the card drag
    let pullDistanceX = 0;

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
      const actualCard = target.closest('article');

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
        console.log(pullDistanceX);

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

      function onEnd(event: any) {
        // remove the event listeners
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);

        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        // user make a choise?
        const decisionMade = Math.abs(pullDistanceX) >= DECISION_THRESHOLD;
        console.log(pullDistanceX);
        console.log(decisionMade);

        // In this point the user had make a decision
        if (decisionMade) {
          const goRight = pullDistanceX >= 0;
          const goLeft = !goRight;

          // add class acording to the decision
          actualCard?.classList.add(goRight ? 'go-right' : 'go-left');
          actualCard?.addEventListener(
            'transitionend',
            () => {
              actualCard.remove();
              isAnimating = false;
            },
            {
              once: true,
            },
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
}
