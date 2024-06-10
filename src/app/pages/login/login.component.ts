import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  isSignUp = false;

  title = "login";
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  responseData: any;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password_confirmation')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon('google', this.domSanitizer.bypassSecurityTrustResourceUrl(google));
    this.matIconRegistry.addSvgIcon('github', this.domSanitizer.bypassSecurityTrustResourceUrl(github));
    this.matIconRegistry.addSvgIcon('twitter', this.domSanitizer.bypassSecurityTrustResourceUrl(twitter));
    this.matIconRegistry.addSvgIcon('facebook', this.domSanitizer.bypassSecurityTrustResourceUrl(facebook));

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required]],
      password_confirmation: [null, [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isSignUp = params['isSignIn'] === 'false';
    });
  }

  toggleForm() {
    this.isSignUp = !this.isSignUp;
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      this.dataService.login(this.loginForm.value).subscribe(
        (response) => {
          console.log(response);
          const token = response.access_token;
          this.dataService.storeToken(token);

          if (response.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (response.role === 'user') {
            this.router.navigate(['/accueil']);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  onSubmitRegister() {
    if (this.registerForm.valid) {
      this.dataService.register(this.registerForm.value).subscribe(
        response => {
          console.log('Registration successful', response);

          const token = response.access_token;
          this.dataService.storeToken(token);

          this.router.navigate(['/accueil']);
        },
        error => {
          console.log('Registration error', error);
        }
      );
    }
  }

  connect(provider: string): void {
    this.dataService.socialLogin(provider).subscribe(
      response => {
        console.log('Received data:', response);
        this.dataService.storeToken(response.token);
      },
      error => {
        console.error('Authentication error:', error);
      }
    );
  }
}
