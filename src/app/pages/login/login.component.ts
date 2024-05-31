import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { initAccordions, initFlowbite } from 'flowbite';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title = "login"
  loginForm!: FormGroup;
  responseData: any;

  ngOnInit() {
  }



  constructor(/*public modalService: ModalService,*/ private fb: FormBuilder, private router: Router, private dataService: DataService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.dataService.login(this.loginForm.value).subscribe(
        (response) => {
          console.log(response);
          const token = response.access_token;
          console.log(token);

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
