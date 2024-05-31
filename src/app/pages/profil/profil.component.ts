import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private dataService: DataService, private router: Router, private modalService: NzModalService) {}


  ngOnInit(): void {
    this.goToProfile();
  }

  goToProfile(): void {
    this.dataService.getUserInfo().subscribe(
      response => {
        console.log('Récupération du profil réussie:', response);
        this.user = response;
      },
      error => {
        console.error('Erreur de récupération du profil:', error);
      }
    );
  }
  openEditProfileModal() {
    const modal = this.modalService.create({
      nzTitle: 'Modifier le profil',
      nzContent: EditProfileComponent,
      nzFooter: null
    });

    // Passer les données au composant
    modal.getContentComponent().user = this.user;
}


}
