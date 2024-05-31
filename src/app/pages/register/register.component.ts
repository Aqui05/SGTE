import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
loginForm!: FormGroup<any>;

 passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('password_confirmation')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
};

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router, ) {
    this.registerForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required]],
      password_confirmation: [null, [Validators.required]],
    } , { validators: this.passwordMatchValidator } );
  }


  onSubmit(): void {
    if (this.registerForm.valid) {
      this.dataService.register(this.registerForm.value).subscribe(
        response => {
          console.log('Inscription réussie', response);

          const token = response.access_token;
          console.log(token);

          this.dataService.storeToken(token);

          this.router.navigate(['/accueil']);

        },
        error => {
          console.log('Erreur lors de l\'inscription', error);
        }
      );
    }
  }

  connect(provider: string): void {
    this.dataService.socialLogin(provider).subscribe(
        response => {
            console.log('Données reçues :', response);
            this.dataService.storeToken(response.token);
        },
        error => {
            console.error('Erreur lors de l\'authentification :', error);
        }
    );
  }
}
