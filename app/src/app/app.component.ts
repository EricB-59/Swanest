import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user/user.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cursorFollower') cursorFollower!: ElementRef;

  title = 'app';

  private mouseX = 0;
  private mouseY = 0;
  private cursorX = 0;
  private cursorY = 0;
  private speed = 0.15;
  private animationFrame: number | null = null;
  private isTouchDevice = 'ontouchstart' in window;
  
  // Event listeners
  private mouseMoveListener: any;
  private mouseLeaveListener: any;
  private mouseEnterListener: any;
  private linkEnterListener: any;
  private linkLeaveListener: any;
  
  constructor(private _userService: UserService) { }

  ngOnInit(): void {
    this._userService.getTest().subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngAfterViewInit(): void {
    this.initializeCursor();
  }
  
  private initializeCursor(): void {
    if (this.isTouchDevice) {
      return;
    }
  
    if (!this.cursorFollower?.nativeElement) {
      console.error('El elemento cursorFollower no existe en el DOM');
      return;
    }
  
    const cursor = this.cursorFollower.nativeElement;
    
    // Configuración con color fijo
    cursor.style.setProperty('background-color', '#532AC0', 'important');
    cursor.style.setProperty('opacity', '1', 'important');
    
    this.mouseMoveListener = this.onMouseMove.bind(this);
    this.mouseLeaveListener = this.onMouseLeave.bind(this);
    this.mouseEnterListener = this.onMouseEnter.bind(this);
    
    window.addEventListener('mousemove', this.mouseMoveListener);
    document.addEventListener('mouseleave', this.mouseLeaveListener);
    document.addEventListener('mouseenter', this.mouseEnterListener);
    
    this.setupLinkEffects();
    this.animateCursor();
  }
  
  private onMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }
  
  private onMouseLeave(): void {
    // En lugar de animar con GSAP, establecemos la opacidad directamente a 0
    this.cursorFollower.nativeElement.style.opacity = '0';
  }
  
  private onMouseEnter(): void {
    gsap.to(this.cursorFollower.nativeElement, {
      duration: 0.5,
      opacity: 1,
      ease: 'power2.out'
    });
  }
  
  private setupLinkEffects(): void {
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
    
    this.linkEnterListener = (e: Event) => {
      gsap.to(this.cursorFollower.nativeElement, {
        duration: 0.3,
        scale: 2,
        opacity: 0.8,
        ease: 'power2.out'
      });
    };
    
    this.linkLeaveListener = () => {
      gsap.to(this.cursorFollower.nativeElement, {
        duration: 0.3,
        scale: 1,
        opacity: 1,
        ease: 'power2.out'
      });
    };
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', this.linkEnterListener);
      element.addEventListener('mouseleave', this.linkLeaveListener);
    });
  }
  
  private animateCursor(): void {
    const animate = () => {
      const dx = this.mouseX - this.cursorX;
      const dy = this.mouseY - this.cursorY;
      
      this.cursorX += dx * this.speed;
      this.cursorY += dy * this.speed;
      
      gsap.set(this.cursorFollower.nativeElement, {
        x: this.cursorX - (this.cursorFollower.nativeElement.offsetWidth / 2) - 3,
        y: this.cursorY - (this.cursorFollower.nativeElement.offsetHeight / 2) - 3
      });
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    this.animationFrame = requestAnimationFrame(animate);
  }

  ngOnDestroy(): void {
    if (!this.isTouchDevice) {
      window.removeEventListener('mousemove', this.mouseMoveListener);
      document.removeEventListener('mouseleave', this.mouseLeaveListener);
      document.removeEventListener('mouseenter', this.mouseEnterListener);
      
      const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', this.linkEnterListener);
        element.removeEventListener('mouseleave', this.linkLeaveListener);
      });
      
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    }
  }
}