import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  userForm: FormGroup;
  submitError = false;
  submitErrorMessage = '';


  user: any;
  loading = false;

  constructor(private fb: FormBuilder, private modalRef: NzModalRef, private dataService: DataService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [],
      state: [],
      city: [],
      address: [],
      zip: [],
      country: [],

    });
  }

  onSubmit() {
    this.loading = true;
    this.dataService.updateUser(this.userForm).subscribe(
      () => {
        this.loading = false;
        this.modalRef.close();
      },
      error => {
        console.error('Erreur de mise à jour du profil:', error);
        this.loading = false;
      }
    );
  }

}
