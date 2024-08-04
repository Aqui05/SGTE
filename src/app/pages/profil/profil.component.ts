import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfileComponent implements OnInit {

  userForm: FormGroup;
  user: any;
  loading = false;

  constructor(private router: Router, private fb: FormBuilder, private dataService: DataService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      state: [''],
      city: [''],
      address: [''],
      zip: [''],
      country: [''],
      role: [{ value: '', disabled: true }] // Désactivé car readonly
    });
  }

  ngOnInit(): void {
    this.goToProfile();
  }

  goToProfile(): void {
    this.dataService.getUserInfo().subscribe(
      response => {
        console.log('Récupération du profil réussie:', response);
        this.user = response;
        this.userForm.patchValue(this.user);
      },
      error => {
        console.error('Erreur de récupération du profil:', error);
      }
    );
  }

  onSubmit() {
    this.loading = true;
    if (this.userForm.valid) {
      this.dataService.updateUser(this.userForm.value).subscribe(
        () => {
          this.loading = false;
        },
        error => {
          console.error('Erreur de mise à jour du profil:', error);
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
    }
  }

  deleteProfile(): void {
    this.dataService.deleteUser().subscribe(
      () => {
        console.log('Profil supprimé avec succès!');
        this.router.navigate(['/']);
      },
      error => {
        console.error('Erreur de suppression du profil:', error);
      }
    );
  }
}
