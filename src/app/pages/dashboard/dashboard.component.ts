import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js/auto';

Chart.register(...registerables);


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  Transport: any[] = [];
  Vehicle : any[] = [];
  Reservation : any[] = [];
  User : any[] = [];
  Merchandise : any[] = [];
  Expedition : any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {

  }
  ngOnInit() : void{
    this.InfoTransport();
    this.InfoVehicle();
    this.InfoReservation();
  }


  cards = [
    {
      title: "Today's Money",
      value: "$53k",
      change: "+55%",
      changeType: "success",
      comparison: "last week",
      icon: "attach_money", // Updated icon
      color: "dark"
    },
    {
      title: "Users",
      value: "23",
      change: "+3%",
      changeType: "success",
      comparison: "last month",
      icon: "person", // Updated icon
      color: "primary"
    },
    {
      title: "Transport",
      value: "3,462",
      change: "-2%",
      changeType: "danger",
      comparison: "yesterday",
      icon: "local_shipping", // Updated icon
      color: "success"
    },
    {
      title: "Expeditions",
      value: "430",
      change: "+5%",
      changeType: "success",
      comparison: "yesterday",
      icon: "flight_takeoff", // Updated icon
      color: "info"
    }
  ];

  InfoCard() : void {

  }

  InfoVehicle() : void {
    this.dataService.getVehicles().subscribe(
      (response) => {
        this.Vehicle = response.data;
        this.createVehicleTypeChart();
      },
      (error) => {
        console.error('Error fetching transports:', error);
      }
    )
  }

  InfoReservation(): void {
    this.dataService.getReservationsList().subscribe(
      (response) => {
        this.Reservation = response.data;
        console.log('Reservations:', response.data);
        this.createReservationChart();
      },
      (error) => {
        console.error('Error fetching transports:', error);
      }
    )
  }

  InfoMerchandise(): void {
    this.dataService.getMerchandises().subscribe(
      (response) => {
        this.Merchandise = response;
        console.log('Merchandise:', response)
      },
      (error) => {
        console.error('Error fetching transports:', error);
      }
    )
  }

  InfoExpedition(): void {
    this.dataService.getExpeditions().subscribe(
      (response) => {
        this.Expedition = response;
        console.log('Expedition:', response)
      },
      (error) => {
        console.error('Error fetching transports:', error);
      }
    )
  }

  InfoUser(): void {
    this.dataService.getUsers().subscribe(
      (response) => {
        this.User = response;
        console.log('User:', response)
      },
      (error) => {
        console.error('Error fetching transports:', error);
      }
    )
  }


  InfoTransport(): void {
    this.dataService.getTransports().subscribe(
      (data) => {
        this.Transport = data.data;
        this.createTransportChart();
      },
      (error) => {
        console.error('Error fetching transports:', error);
      }
    );
  }

  countTransportStatus(): { [key: string]: number } {
    const statusCounts: { [key: string]: number } = {
      confirmed: 0,
      inProgress: 0,
      finished: 0,
      canceled: 0
    };

    this.Transport.forEach(transport => {
      if (transport.status in statusCounts) {
        statusCounts[transport.status]++;
      }
    });

    return statusCounts;
  }

  createTransportChart(): void {
    const statusCounts = this.countTransportStatus();

    const data = {
      labels: ['Confirmed', 'In Progress', 'Finished', 'Canceled'],
      datasets: [{
        label: 'Transport',
        data: [
          statusCounts['confirmed'],
          statusCounts['inProgress'],
          statusCounts['finished'],
          statusCounts['canceled']
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336']
      }]
    };

    const config = {
      type: 'bar' as ChartType,
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };

    new Chart('transportStatusChart', config);
  }


  countVehicleType(): { [key: string]: number } {
    const typeCounts: { [key: string]: number } = {};

    this.Vehicle.forEach(vehicle => {
      const type = vehicle.type;
      if (type in typeCounts) {
        typeCounts[type]++;
      } else {
        typeCounts[type] = 1;
      }
    });

    return typeCounts;
  }

  createVehicleTypeChart(): void {
    const typeCounts = this.countVehicleType();

    const data = {
      labels: Object.keys(typeCounts),
      datasets: [{
        label: 'Vehicle Types',
        data: Object.values(typeCounts),
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0', '#00bcd4', '#cddc39', '#ffeb3b'] // Assurez-vous d'avoir assez de couleurs pour vos types de transport
      }]
    };

    const config = {
      type: 'bar' as ChartType,
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };

    new Chart('VehicleTypeChart', config);
  }




  countReservationStatus(): { [key: string]: number } {
    const statusCounts: { [key: string]: number } = {
      confirmed: 0,
      inProgress: 0,
      finished: 0,
      canceled: 0
    };

    this.Reservation.forEach(reservation => {
      if (reservation.status in statusCounts) {
        statusCounts[reservation.status]++;
      }
    });

    return statusCounts;
  }

  createReservationChart(): void {
    const statusCounts = this.countReservationStatus();

    const data = {
      labels: ['Confirmed', 'Used', 'Delayed', 'Canceled'],
      datasets: [{
        label: 'Transport',
        data: [
          statusCounts['confirmed'],
          statusCounts['Used'],
          statusCounts['Delayed'],
          statusCounts['canceled']
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336']
      }]
    };

    const config = {
      type: 'bar' as ChartType,
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };

    new Chart('ReservationStatusChart', config);
  }









    /*

    * 1. **Graphique des performances des véhicules :**
      *- Un graphique en ligne montrant l'évolution de la performance des véhicules au fil du temps. Cela peut inclure des métriques telles que la consommation de carburant, la distance parcourue, les temps d'arrêt, etc. Cela aide à identifier les véhicules les plus efficaces et ceux qui nécessitent une maintenance ou des ajustements.

    *  2. **Répartition des types de véhicules :**
      *- Un graphique circulaire ou un diagramme en barres montrant la répartition des différents types de véhicules utilisés dans le parc (par exemple, camions, voitures, motos). Cela aide à visualiser la diversité du parc de véhicules et à prendre des décisions stratégiques sur les futurs investissements et les besoins en équipement.

    *  3. **Graphique de suivi des expéditions :**
        *- Un graphique en barres ou un graphique de ligne montrant le nombre d'expéditions traitées par jour, semaine ou mois. Cela offre une vue d'ensemble de la charge de travail et peut aider à identifier les périodes de pointe et les tendances saisonnières.

    *  4. **Graphique de suivi des livraisons en temps réel :**
        *- Un graphique en temps réel montrant l'emplacement et l'état des livraisons en cours. Cela peut être réalisé avec des graphiques de type "heatmap" ou des graphiques de dispersion pour visualiser la distribution géographique des livraisons et les délais de livraison.

    *  5. **Graphique de gestion des stocks :**
        *- Un graphique en barres ou un diagramme circulaire montrant la répartition des stocks disponibles par entrepôt ou par type de produit. Cela permet de gérer efficacement les niveaux de stock et d'anticiper les besoins de réapprovisionnement.

    *  6. **Graphique des coûts de transport :**
        *- Un graphique en ligne ou un graphique en barres montrant l'évolution des coûts de transport au fil du temps. Cela peut inclure des coûts de carburant, de maintenance, de péage, etc. Ces informations sont cruciales pour optimiser les itinéraires et minimiser les dépenses.

    *  7. **Graphique de répartition des types de transport :**
        *- Ce graphique pourrait montrer la répartition des différents types de transport (camion, train, avion, etc.) utilisés pour les expéditions. Cela pourrait aider à identifier les types de transport les plus utilisés et ceux qui pourraient nécessiter plus d’investissement.

  */



}
