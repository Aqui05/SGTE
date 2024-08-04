import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const user = params['user'];

      if (token) {

        // Envoyer un message à l'onglet principal pour fermeture du popup et redirection
        window.opener.postMessage({ token, user }, window.location.origin);

        // Fermer la fenêtre popup
        window.close();
      } else {
        console.error('Jeton non trouvé');
      }
    });
  }
}
