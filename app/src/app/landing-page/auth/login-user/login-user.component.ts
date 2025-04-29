import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ErrorFieldsDirective } from '../../directives/error-fields.directive';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../../../app/components/error-modal/error-modal.component';

@Component({
  selector: 'app-login-user',
  imports: [ReactiveFormsModule, ErrorFieldsDirective],
  templateUrl: './login-user.component.html',
  styles: ``,
})
export class LoginUserComponent {
  constructor(
    private router: Router,
    private _matDialog: MatDialog,
  ) {}

  @Input() closeModal: () => void = () => {};

  closeAuthModal() {
    if (this.closeModal) {
      this.closeModal();
    }
  }

  exist: boolean = false;

  identifier: any = '';
  password: any = '';

  userService: UserService = inject(UserService);

  form = new FormGroup({
    identifier: new FormControl(''),
    password: new FormControl(''),
  });

  login() {
    this.exist = false;

    this.identifier = this.form.value.identifier;
    this.password = this.form.value.password;

    this.userService.login(this.identifier, this.password).subscribe({
      next: (v) => {
        if (!v.profile) {
          this._matDialog.open(ErrorModalComponent, {
            data: { error: 'No existe perfil ligado a este usuraio' },
            panelClass: 'transparent-modal',
            backdropClass: 'transparent-backdrop',
            hasBackdrop: true,
          });
          return;
        }
        sessionStorage.setItem('user', JSON.stringify(v));
        this.router.navigate(['app']);
        this.closeAuthModal();
      },
      error: (e) => console.error(e),
    });
  }
}
