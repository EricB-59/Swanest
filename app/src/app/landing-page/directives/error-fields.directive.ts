import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appErrorFields]',
})
export class ErrorFieldsDirective implements OnInit {
  private errorElement: HTMLElement | null = null;
  private iconElement: HTMLElement | null = null;
  private textElement: Text | null = null;

  private errorMessages: { [key: string]: string } = {
    required: 'Este campo es obligatorio',
    email: 'Debe ingresar un correo electrónico válido',
    password: 'La contraseña no es valida',
    minlength: 'No cumple con la longitud mínima requerida',
    maxlength: 'Excede la longitud máxima permitida',
    pattern: 'Formato No valido',
    min: 'El valor es menor al mínimo permitido',
    max: 'El valor es mayor al máximo permitido',
  };

  constructor(
    private elRef: ElementRef,
    private control: NgControl,
    private renderer: Renderer2,
  ) {}
  ngOnInit(): void {
    // Create element to display errors
    this.errorElement = this.renderer.createElement('span');
    this.renderer.addClass(this.errorElement, 'error-message');
    this.renderer.setStyle(this.errorElement, 'color', '#FF3B30');
    this.renderer.setStyle(this.errorElement, 'font-size', '0.8rem');
    this.renderer.setStyle(this.errorElement, 'margin-top', '4px');

    // Configurar como flex pero inicialmente oculto
    this.renderer.setStyle(this.errorElement, 'display', 'none'); // Mover esta línea al final
    this.renderer.setStyle(this.errorElement, 'align-items', 'center');
    this.renderer.setStyle(this.errorElement, 'gap', '6px');

    // Crear el icono
    this.iconElement = this.renderer.createElement('img');
    this.renderer.setAttribute(
      this.iconElement,
      'src',
      'assets/images/danger-icon.svg',
    );
    this.renderer.setStyle(this.iconElement, 'width', '16px');
    this.renderer.setStyle(this.iconElement, 'height', '16px');
    this.renderer.setStyle(this.iconElement, 'vertical-align', 'middle');

    // Crear nodo de texto (vacío por ahora)
    this.textElement = this.renderer.createText('');

    // Añadir icono y texto al span
    this.renderer.appendChild(this.errorElement, this.iconElement);
    this.renderer.appendChild(this.errorElement, this.textElement);

    // Insertar el mensaje después del input
    const parentElement = this.elRef.nativeElement.parentElement;
    if (parentElement) {
      this.renderer.appendChild(parentElement, this.errorElement);
    }

    this.control.statusChanges?.subscribe(() => {
      this.updateStyles();
    });

    // Initial validation after components are loaded
    setTimeout(() => {
      this.updateStyles();
    });
  }
  // Update styles when an input event occurs
  @HostListener('input')
  onInput(): void {
    this.updateStyles();
  }
  // Updating styles when focus is lost
  @HostListener('blur')
  onBlur(): void {
    this.updateStyles();
  }

  private updateStyles() {
    // Check if the control exists and has a status
    if (!this.control || !this.control.control) return;

    const isInvalid =
      this.control.invalid && (this.control.dirty || this.control.touched);
    const isValid =
      this.control.valid && (this.control.dirty || this.control.touched);
    const isEmpty =
      this.control.value === '' ||
      this.control.value === null ||
      this.control.value === undefined;
    const isNeutral = !isValid && !isInvalid; // No es ni válido ni inválido

    const inputElement = this.elRef.nativeElement;
    // Establecer el color del borde a negro por defecto
    this.renderer.setStyle(inputElement, 'border-color', 'black');

    // Para campos válidos
    if (isValid && !isEmpty) {
      this.renderer.setStyle(inputElement, 'border-color', '#34C759'); // verde
      if (this.errorElement) {
        this.renderer.setStyle(this.errorElement, 'display', 'none');
      }
      this.updateLabelColor('valid');
    }

    // Para campos inválidos
    else if (isInvalid) {
      this.renderer.setStyle(inputElement, 'border-color', '#FF3B30'); // rojo

      if (this.errorElement) {
        this.renderer.setStyle(this.errorElement, 'display', 'flex');
        const errorMessage = this.getErrorMessage();
        if (this.textElement) {
          this.renderer.setValue(this.textElement, errorMessage);
        }
      }
      this.updateLabelColor('invalid');
    }

    // Para estado neutral (ni válido ni inválido)
    else {
      if (this.errorElement) {
        this.renderer.setStyle(this.errorElement, 'display', 'none');
      }
      this.updateLabelColor('neutral');
    }
  }

  private updateLabelColor(state: 'valid' | 'invalid' | 'neutral'): void {
    // Buscar el span del label
    if (this.elRef.nativeElement.parentElement) {
      const spans =
        this.elRef.nativeElement.parentElement.querySelectorAll('span');
      if (spans && spans.length > 0) {
        // Solo aplicar al texto del label principal, no al asterisco o mensaje de error
        for (let i = 0; i < spans.length; i++) {
          const span = spans[i];
          if (span !== this.errorElement && !span.textContent?.includes('*')) {
            let color = 'black'; // Color por defecto (neutral)

            if (state === 'valid') {
              color = '#34C759'; // verde para válido
            } else if (state === 'invalid') {
              color = '#FF3B30'; // rojo para inválido
            }

            this.renderer.setStyle(span, 'color', color);
          }
        }
      }
    }
  }
  private getErrorMessage(): string {
    if (!this.control.errors) return '';
    const errorKey = Object.keys(this.control.errors)[0];
    if (errorKey === 'required') {
      return this.errorMessages['required'];
    }

    // Caso especial para email
    if (errorKey === 'email') {
      return this.errorMessages['email'];
    }

    // Mensajes específicos para errores con parámetros
    if (errorKey === 'minlength') {
      const requiredLength = this.control.errors['minlength'].requiredLength;
      const actualLength = this.control.errors['minlength'].actualLength;
      return `Mínimo ${requiredLength} caracteres (tiene ${actualLength})`;
    }

    if (errorKey === 'maxlength') {
      const requiredLength = this.control.errors['maxlength'].requiredLength;
      const actualLength = this.control.errors['maxlength'].actualLength;
      return `Máximo ${requiredLength} caracteres (tiene ${actualLength})`;
    }

    if (errorKey === 'min') {
      const min = this.control.errors['min'].min;
      return `El valor mínimo es ${min}`;
    }

    if (errorKey === 'max') {
      const max = this.control.errors['max'].max;
      return `El valor máximo es ${max}`;
    }

    if (errorKey === 'pattern') {
      // Determinar tipo de campo según su ID o tipo
      const elementId = this.elRef.nativeElement.id;
      const inputType = this.elRef.nativeElement.type;

      // Mensajes específicos para cada tipo de campo con pattern
      if (inputType === 'email' || elementId.includes('email')) {
        return 'Formato de correo electrónico inválido';
      }

      if (inputType === 'password' || elementId === 'password') {
        return 'Mín. 8 caracteres, con mayúscula, minúscula y número';
      }

      if (elementId === 'username' || elementId.includes('username')) {
        return 'El nombre de usuario solo puede contener letras y números';
      }
      // Si no hay un caso específico, usar el mensaje genérico de pattern
      return this.errorMessages['pattern'];
    }
    // Usar mensaje predefinido o mensaje genérico
    return this.errorMessages[errorKey] || 'Error de validación';
  }
}
