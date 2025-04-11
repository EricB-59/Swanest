import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appErrorFields]',
  standalone: true
})
export class ErrorFieldsDirective implements OnInit {
  private errorElement: HTMLElement | null = null;
  private iconElement: HTMLElement | null = null;
  private textElement: Text | null = null;
  private isValid = true;
  private customErrorMessage = '';

  // Puedes usar estas propiedades para validación manual en caso de no tener NgControl
  @Input() required = false;
  @Input() minLength: number | null = null;
  @Input() pattern: string | null = null;
  @Input() customError: string | null = null;

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
    @Optional() private control: NgControl,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    // Crear el elemento para mostrar errores
    this.errorElement = this.renderer.createElement('span');
    this.renderer.addClass(this.errorElement, 'error-message');
    this.renderer.setStyle(this.errorElement, 'color', '#FF3B30');
    this.renderer.setStyle(this.errorElement, 'font-size', '0.8rem');
    this.renderer.setStyle(this.errorElement, 'margin-top', '4px');
    this.renderer.setStyle(this.errorElement, 'display', 'none');
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

    // Si estamos utilizando NgControl, suscribirse a los cambios de estado
    if (this.control) {
      this.control.statusChanges?.subscribe(() => {
        this.updateStyles();
      });
    }

    // Validación inicial después de cargar los componentes
    setTimeout(() => {
      this.updateStyles();
    });
  }

  // Actualizar estilos cuando ocurre un evento de input
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    // Si no tenemos NgControl, hacemos validación manual
    if (!this.control) {
      this.validateManually((event.target as HTMLInputElement).value);
    }
    this.updateStyles();
  }

  // Actualizar estilos cuando se pierde el foco
  @HostListener('blur')
  onBlur(): void {
    if (!this.control) {
      this.validateManually((this.elRef.nativeElement as HTMLInputElement).value);
    }
    this.updateStyles();
  }

  // Validación manual para cuando no hay NgControl
  private validateManually(value: string): void {
    let isValid = true;
    let errorMessage = '';

    // Validación required
    if (this.required && (!value || value.trim() === '')) {
      isValid = false;
      errorMessage = this.errorMessages['required'];
    }
    // Validación minLength
    else if (this.minLength && value && value.length < this.minLength) {
      isValid = false;
      errorMessage = `Mínimo ${this.minLength} caracteres (tiene ${value.length})`;
    }
    // Validación pattern
    else if (this.pattern && value && !new RegExp(this.pattern).test(value)) {
      isValid = false;
      
      // Determinar tipo de campo según su ID o tipo
      const elementId = this.elRef.nativeElement.id;
      const inputType = this.elRef.nativeElement.type;

      if (inputType === 'email' || elementId.includes('email')) {
        errorMessage = 'Formato de correo electrónico inválido';
      } else if (inputType === 'password' || elementId === 'password') {
        errorMessage = 'Mín. 8 caracteres, con mayúscula, minúscula y número';
      } else if (elementId === 'username' || elementId.includes('username')) {
        errorMessage = 'El usuario solo puede contener letras y números';
      } else if (elementId === 'name' || elementId === 'surname') {
        errorMessage = 'Debe contener solo letras';
      } else {
        errorMessage = this.errorMessages['pattern'];
      }
    }
    // Error personalizado
    else if (this.customError) {
      isValid = false;
      errorMessage = this.customError;
    }

    this.isValid = isValid;
    this.customErrorMessage = errorMessage;
  }

  private updateStyles() {
    const inputElement = this.elRef.nativeElement;
    
    // Establecer el color del borde a negro por defecto
    this.renderer.setStyle(inputElement, 'border-color', 'black');

    // Si estamos usando NgControl
    if (this.control && this.control.control) {
      const isInvalid = this.control.invalid && (this.control.dirty || this.control.touched);
      const isValid = this.control.valid && (this.control.dirty || this.control.touched);
      const isEmpty = this.control.value === '' || this.control.value === null || this.control.value === undefined;
      const isNeutral = !isValid && !isInvalid;

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
      // Para estado neutral
      else {
        if (this.errorElement) {
          this.renderer.setStyle(this.errorElement, 'display', 'none');
        }
        this.updateLabelColor('neutral');
      }
    } 
    // Si no estamos usando NgControl (validación manual)
    else {
      const value = (inputElement as HTMLInputElement).value;
      const isEmpty = !value || value.trim() === '';
      
      // Si es válido y no está vacío
      if (this.isValid && !isEmpty) {
        this.renderer.setStyle(inputElement, 'border-color', '#34C759'); // verde
        if (this.errorElement) {
          this.renderer.setStyle(this.errorElement, 'display', 'none');
        }
        this.updateLabelColor('valid');
      }
      // Si no es válido
      else if (!this.isValid) {
        this.renderer.setStyle(inputElement, 'border-color', '#FF3B30'); // rojo
        if (this.errorElement) {
          this.renderer.setStyle(this.errorElement, 'display', 'flex');
          if (this.textElement) {
            this.renderer.setValue(this.textElement, this.customErrorMessage);
          }
        }
        this.updateLabelColor('invalid');
      }
      // Estado neutral
      else {
        if (this.errorElement) {
          this.renderer.setStyle(this.errorElement, 'display', 'none');
        }
        this.updateLabelColor('neutral');
      }
    }
  }

  private updateLabelColor(state: 'valid' | 'invalid' | 'neutral'): void {
    // Buscar el elemento padre (label o contenedor)
    const parentElement = this.elRef.nativeElement.parentElement;
    if (!parentElement) return;
  
    // Buscar tanto spans como h2 dentro del padre
    const spans = parentElement.querySelectorAll('span');
    const headings = parentElement.querySelectorAll('h2');
    
    // Color según el estado
    let color = 'black'; // Color por defecto (neutral)
    if (state === 'valid') {
      color = '#34C759'; // verde para válido
    } else if (state === 'invalid') {
      color = '#FF3B30'; // rojo para inválido
    }
  
    // Aplicar color a los spans (excluyendo el mensaje de error)
    if (spans && spans.length > 0) {
      for (let i = 0; i < spans.length; i++) {
        const span = spans[i];
        if (span !== this.errorElement && !span.textContent?.includes('*')) {
          this.renderer.setStyle(span, 'color', color);
        }
      }
    }
  
    // Aplicar color a los h2
    if (headings && headings.length > 0) {
      for (let i = 0; i < headings.length; i++) {
        this.renderer.setStyle(headings[i], 'color', color);
      }
    }
  }

  private getErrorMessage(): string {
    if (!this.control || !this.control.errors) return '';
    
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
        return 'El usuario solo puede contener letras y números';
      }
      
      if(elementId === 'name' || elementId === 'surname') {
        return 'Debe contener solo letras';
      }
      
      // Si no hay un caso específico, usar el mensaje genérico de pattern
      return this.errorMessages['pattern'];
    }
    
    // Usar mensaje predefinido o mensaje genérico
    return this.errorMessages[errorKey] || 'Error de validación';
  }
}