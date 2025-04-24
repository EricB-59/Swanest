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

  // Properties for manual validation in case NgControl is not provided
  @Input() required = false;
  @Input() minLength: number | null = null;
  @Input() pattern: string | null = null;
  @Input() customError: string | null = null;
  @Input() validList: string[] | null = null;
  @Input() exactSelections: number | null = null;
  @Input() currentSelections: any[] | null = null;


  private errorMessages: { [key: string]: string } = {
    required: 'Este campo es obligatorio',
    email: 'Debe ingresar un correo electrónico válido',
    password: 'La contraseña no es valida',
    minlength: 'No cumple con la longitud mínima requerida',
    maxlength: 'Excede la longitud máxima permitida',
    pattern: 'Formato No valido',
    min: 'El valor es menor al mínimo permitido',
    max: 'El valor es mayor al máximo permitido',
    validList: 'Seleccione una opción válida de la lista',
    exactSelections: 'Debe seleccionar exactamente 5 opciones',

  };

  constructor(
    private elRef: ElementRef,
    @Optional() private control: NgControl,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    // Create the element to display errors
    this.errorElement = this.renderer.createElement('span');
    this.renderer.addClass(this.errorElement, 'error-message');
    this.renderer.setStyle(this.errorElement, 'color', '#FF3B30');
    this.renderer.setStyle(this.errorElement, 'font-size', '0.8rem');
    this.renderer.setStyle(this.errorElement, 'margin-top', '4px');
    this.renderer.setStyle(this.errorElement, 'display', 'none');
    this.renderer.setStyle(this.errorElement, 'align-items', 'center');
    this.renderer.setStyle(this.errorElement, 'gap', '6px');

    // Create the icon
    this.iconElement = this.renderer.createElement('img');
    this.renderer.setAttribute(
      this.iconElement,
      'src',
      'assets/images/danger-icon.svg',
    );
    this.renderer.setStyle(this.iconElement, 'width', '16px');
    this.renderer.setStyle(this.iconElement, 'height', '16px');
    this.renderer.setStyle(this.iconElement, 'vertical-align', 'middle');

    // Create text node (empty for now)
    this.textElement = this.renderer.createText('');

    // Add icon and text to the span
    this.renderer.appendChild(this.errorElement, this.iconElement);
    this.renderer.appendChild(this.errorElement, this.textElement);

    // Insert the error message after the input element
    const parentElement = this.elRef.nativeElement.parentElement;
    if (parentElement) {
      // Busca un elemento ul que siga al elemento actual
      const nextElement = parentElement.querySelector('ul');
      if (nextElement && this.exactSelections !== null) {
        // Si es para validar selecciones, coloca el error antes de la lista
        this.renderer.insertBefore(parentElement, this.errorElement, nextElement);
      } else {
        // Para otros casos, añádelo al final como antes
        this.renderer.appendChild(parentElement, this.errorElement);
      }
    }

    // If NgControl is being used, subscribe to status changes
    if (this.control) {
      this.control.statusChanges?.subscribe(() => {
        this.updateStyles();
      });
    }

    // Initial validation after components are loaded
    setTimeout(() => {
      this.updateStyles();
    });
  }

  // Update styles when an input event occurs
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    // If NgControl is not available, perform manual validation
    if (!this.control) {
      this.validateManually((event.target as HTMLInputElement).value);
    }
    this.updateStyles();
  }

  // Update styles when focus is lost
  @HostListener('blur')
  onBlur(): void {
    if (!this.control) {
      this.validateManually((this.elRef.nativeElement as HTMLInputElement).value);
    }
    this.updateStyles();
  }
  @HostListener('change')
  onChange(): void {
    // Si tenemos exactSelections y currentSelections, validamos las selecciones
    if (this.exactSelections !== null && this.currentSelections) {
      this.validateSelections();
    } else if (!this.control) {
      // Validación manual para otros tipos de inputs
      this.validateManually((this.elRef.nativeElement as HTMLInputElement).value);
    }
    this.updateStyles();
  }

  // Manual validation for when NgControl is not present
  private validateManually(value: string): void {
    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (this.required && (!value || value.trim() === '')) {
      isValid = false;
      errorMessage = this.errorMessages['required'];
    }
    // minLength validation
    else if (this.minLength && value && value.length < this.minLength) {
      isValid = false;
      errorMessage = `Mínimo ${this.minLength} caracteres (tiene ${value.length})`;
    } 
    // Validation for provinces or valid list
    else if (this.validList && value && this.validList.length > 0) {
      // Normaliza el valor del input y los valores de la lista para comparación
      const normalizedValue = value.trim().toLowerCase();
      const normalizedList = this.validList.map(item => item.trim().toLowerCase());
      
      if (!normalizedList.includes(normalizedValue)) {
        isValid = false;
        
        const elementId = this.elRef.nativeElement.id;
        if (elementId === 'province') {
          errorMessage = 'Seleccione una provincia válida';
        } else {
          errorMessage = this.errorMessages['validList'];
        }
      }
    } else if (this.exactSelections !== null && this.currentSelections &&  this.currentSelections.length !== this.exactSelections) {
        isValid = false;
        errorMessage = this.errorMessages['exactSelections'];
    }
    // Pattern validation
    else if (this.pattern && value && !new RegExp(this.pattern).test(value)) {
      isValid = false;
      
      // Determine field type based on its ID or type
      const elementId = this.elRef.nativeElement.id;
      const inputType = this.elRef.nativeElement.type;

      if (inputType === 'email' || elementId.includes('email')) {
        errorMessage = 'Formato de correo electrónico inválido';
      } else if (inputType === 'password' || elementId.includes('password')) {
        errorMessage = 'Mín. 8 caracteres, con mayúscula, minúscula y número';
      } else if (elementId === 'username' || elementId.includes('username')) {
        errorMessage = 'El usuario solo puede contener letras y números';
      } else if (elementId === 'name' || elementId.includes('name')) {
        errorMessage = 'Debe contener solo letras';
      } else if (elementId === 'surname' || elementId.includes('surname')) {
        errorMessage = 'Debe contener solo letras';
      } else {
        errorMessage = this.errorMessages['pattern'];
      }
    }
    // Custom error
    else if (this.customError) {
      isValid = false;
      errorMessage = this.customError;
    }

    this.isValid = isValid;
    this.customErrorMessage = errorMessage;
  } 

  private updateStyles() {
    const inputElement = this.elRef.nativeElement;
    
    // Set the default border color to black
    this.renderer.setStyle(inputElement, 'border-color', 'black');
   // Para validaciones de selecciones exactas (como los intereses)
  if (this.exactSelections !== null && this.currentSelections) {
    // Determinar si el usuario ha interactuado con el selector de intereses
    // (esto podría ser cuando hay al menos una selección o cuando el formulario ha sido tocado)
    const hasInteraction = this.currentSelections.length > 0;
    const hasExactSelections = this.currentSelections.length === this.exactSelections;
    
    // Debug para verificar los valores
    console.log('Current selections:', this.currentSelections.length, 'Required:', this.exactSelections, 'Valid:', hasExactSelections);
    
    if (hasExactSelections) {
      // CASO VÁLIDO: Tiene exactamente el número de selecciones requeridas
      if (this.errorElement) {
        this.renderer.setStyle(this.errorElement, 'display', 'none');
      }
      // Importante: cambia el color del borde a verde
      this.renderer.setStyle(inputElement, 'border-color', '#34C759');
      this.updateLabelColor('valid');
    } 
    else if (hasInteraction) {
      // CASO INVÁLIDO: Ya hay interacción pero no tiene el número exacto
      if (this.errorElement) {
        this.renderer.setStyle(this.errorElement, 'display', 'flex');
        if (this.textElement) {
          this.renderer.setValue(
            this.textElement, 
            `Debe seleccionar exactamente ${this.exactSelections} opciones`
          );
        }
      }
      // Importante: cambia el color del borde a rojo
      this.renderer.setStyle(inputElement, 'border-color', '#FF3B30');
      this.updateLabelColor('invalid');
    } 
    else {
      // CASO INICIAL: Sin interacción aún
      if (this.errorElement) {
        this.renderer.setStyle(this.errorElement, 'display', 'none');
      }
      this.updateLabelColor('neutral');
    }
    
    // Importante: return para que no continúe con el resto de la validación
    return;
  }
    // If using NgControl
    if (this.control && this.control.control) {
      const isInvalid = this.control.invalid && (this.control.dirty || this.control.touched);
      const isValid = this.control.valid && (this.control.dirty || this.control.touched);
      const isEmpty = this.control.value === '' || this.control.value === null || this.control.value === undefined;
      const isNeutral = !isValid && !isInvalid;

      // For valid fields
      if (isValid && !isEmpty) {
        this.renderer.setStyle(inputElement, 'border-color', '#34C759'); // green
        if (this.errorElement) {
          this.renderer.setStyle(this.errorElement, 'display', 'none');
        }
        this.updateLabelColor('valid');
      }
      // For invalid fields
      else if (isInvalid) {
        this.renderer.setStyle(inputElement, 'border-color', '#FF3B30'); // red
        if (this.errorElement) {
          this.renderer.setStyle(this.errorElement, 'display', 'flex');
          const errorMessage = this.getErrorMessage();
          if (this.textElement) {
            this.renderer.setValue(this.textElement, errorMessage);
          }
        }
        this.updateLabelColor('invalid');
      }
      // For neutral state
      else {
        if (this.errorElement) {
          this.renderer.setStyle(this.errorElement, 'display', 'none');
        }
        this.updateLabelColor('neutral');
      }
    } 
    // If NgControl is not used (manual validation)
    else {
      const value = (inputElement as HTMLInputElement).value;
      const isEmpty = !value || value.trim() === '';
      
      // If valid and not empty
      if (this.isValid && !isEmpty) {
        this.renderer.setStyle(inputElement, 'border-color', '#34C759'); // green
        if (this.errorElement) {
          this.renderer.setStyle(this.errorElement, 'display', 'none');
        }
        this.updateLabelColor('valid');
      }
      // If not valid
      else if (!this.isValid) {
        this.renderer.setStyle(inputElement, 'border-color', '#FF3B30'); // red
        if (this.errorElement) {
          this.renderer.setStyle(this.errorElement, 'display', 'flex');
          if (this.textElement) {
            this.renderer.setValue(this.textElement, this.customErrorMessage);
          }
        }
        this.updateLabelColor('invalid');
      }
      // Neutral state
      else {
        if (this.errorElement) {
          this.renderer.setStyle(this.errorElement, 'display', 'none');
        }
        this.updateLabelColor('neutral');
      }
    }
  }

  private updateLabelColor(state: 'valid' | 'invalid' | 'neutral'): void {
    // Encuentra el elemento actual o su contenedor
    const currentElement = this.elRef.nativeElement;
    
    // Para evitar que afecte a otras etiquetas, verifica si currentElement es un label o input
    const elementsToUpdate = [];
    
    if (currentElement.tagName === 'LABEL') {
      // Si es una etiqueta, solo afecta a esta etiqueta
      elementsToUpdate.push(currentElement);
    } else {
      // Si es un input, busca su etiqueta asociada
      const parentLabel = currentElement.closest('label');
      if (parentLabel) {
        elementsToUpdate.push(parentLabel);
      }
    }
    
    // Color basado en el estado
    let color = 'black'; // Color por defecto (neutral)
    if (state === 'valid') {
      color = '#34C759'; // verde para válido
    } else if (state === 'invalid') {
      color = '#FF3B30'; // rojo para inválido
    }
    
    // Aplica el color solo a los elementos específicos
    for (const element of elementsToUpdate) {
      // Encuentra y actualiza spans y h2 dentro del elemento
      const spans = element.querySelectorAll('span:not(.error-message)');
      const headings = element.querySelectorAll('h2');
      
      // Aplica color a los spans (excluyendo el mensaje de error)
      if (spans && spans.length > 0) {
        for (let i = 0; i < spans.length; i++) {
          const span = spans[i];
          if (span !== this.errorElement && !span.textContent?.includes('*')) {
            this.renderer.setStyle(span, 'color', color);
          }
        }
      }
      
      // Aplica color a los elementos h2
      if (headings && headings.length > 0) {
        for (let i = 0; i < headings.length; i++) {
          this.renderer.setStyle(headings[i], 'color', color);
        }
      }
    }
  }
  private validateSelections(): void {
    if (!this.currentSelections) return;
    
    // Comprobación directa - simplifica la lógica
    const hasExactSelections = this.currentSelections.length === this.exactSelections;
    
    this.isValid = hasExactSelections;
    
    if (!hasExactSelections) {
      this.customErrorMessage = `Debe seleccionar exactamente ${this.exactSelections} opciones`;
    } else {
      this.customErrorMessage = '';
    }
  }
  private getErrorMessage(): string {
    if (!this.control || !this.control.errors) return '';
    
    const errorKey = Object.keys(this.control.errors)[0];
    
    // Special case for validList (provinces or other lists)
    if (errorKey === 'validList') {
      const elementId = this.elRef.nativeElement.id;
      if (elementId === 'province') {
        return 'Seleccione una provincia válida';
      }
      return this.errorMessages['validList'];
    }
    
    if (errorKey === 'required') {
      return this.errorMessages['required'];
    }

    // Special case for email
    if (errorKey === 'email') {
      return this.errorMessages['email'];
    }

    // Specific messages for errors with parameters
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
      // Determine field type based on its ID or type
      const elementId = this.elRef.nativeElement.id;
      const inputType = this.elRef.nativeElement.type;

      // Specific messages for each field type with pattern
      if (inputType === 'email' || elementId.includes('email')) {
        return 'Formato de correo electrónico inválido';
      }

      if (inputType === 'password' || elementId.includes('password')) {
        return 'Mín. 8 caracteres, con mayúscula, minúscula y número';
      }

      if (elementId === 'username' || elementId.includes('username')) {
        return 'El usuario solo puede contener letras y números';
      }
      
      if(elementId === 'name' || elementId.includes('name') || 
         elementId === 'surname' || elementId.includes('surname')) {
        return 'Debe contener solo letras';
      }
      
      // If no specific case, use the generic pattern error message
      return this.errorMessages['pattern'];
    }
    
    // Use predefined message or generic error message
    return this.errorMessages[errorKey] || 'Error de validación';
  }
}
