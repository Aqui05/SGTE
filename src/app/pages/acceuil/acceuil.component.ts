import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Chart, ChartConfiguration, ChartType, registerables, TooltipItem } from 'chart.js/auto';

Chart.register(...registerables);


@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.css']
})
export class AcceuilComponent implements OnInit{


    Transport: any[] = [];
    Reservation : any[] = [];
    Merchandise : any[] = [];
    Expedition : any[] = [];
    CompletedDelivery : any[] = [];

    constructor(
      private dataService: DataService,
      private router: Router,
    ) {

    }
    ngOnInit() : void{
      this.InfoTransport();
      this.InfoReservation();
      this.InfoExpedition();
      this.InfoMerchandise();
    }


    InfoReservation(): void {
      this.dataService.getReservations().subscribe(
        (response) => {
          this.Reservation = response.data;
          console.log('Reservations:', response.data);
          this.createReservationChart();
          this.InfoCard()
        },
        (error) => {
          console.error('Error fetching transports:', error);
        }
      )
    }

    InfoMerchandise(): void {
      this.dataService.getMerchandises().subscribe(
        (response) => {
          this.Merchandise = response.data;
          console.log('Merchandise:', response.data);
          this.createMerchandiseStatusChart();
          this.InfoCard()
        },
        (error) => {
          console.error('Error fetching transports:', error);
        }
      )
    }

    InfoExpedition(): void {
      this.dataService.getUserExpeditions().subscribe(
        (response) => {
          this.Expedition = response.data;
          console.log('Expedition:', response.data);
          this.InfoCard();
          this.createExpeditionChart();
          this.CompletedDelivery = this.Expedition.filter(expedition => expedition.status === 'delivré');
        },
        (error) => {
          console.error('Erreur lors de la récupération des expéditions:', error);
        }
      );
    }



    InfoTransport(): void {
      this.dataService.getUserTransports().subscribe(
        (data) => {
          this.Transport = data.data;
          this.createTransportChart();
          this.createTransportTypeChart();
          this.InfoCard();
          console.log('Transport:', data.data);
          console.log(this.Transport.length)
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
        cancelled: 0
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
        labels: ['Confirmed', 'In Progress', 'Finished', 'Cancelled'],
        datasets: [{
          label: 'Transport',
          data: [
            statusCounts['confirmed'],
            statusCounts['inProgress'],
            statusCounts['finished'],
            statusCounts['cancelled']
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


    countExpeditionStatus(): { [key: string]: number } {
      const statusCounts: { [key: string]: number } = {
        confirmé: 0,
        'en transit': 0,
        annulé: 0,
        delivré: 0,
        planification: 0
      };

      this.Expedition.forEach(expedition => {
        if (expedition.status in statusCounts) {
          statusCounts[expedition.status]++;
        }
      });

      return statusCounts;
    }

    createExpeditionChart(): void {
      const statusCounts = this.countExpeditionStatus();

      const data = {
        labels: ['Confirmé', 'planification', 'En transit', 'Délivré', 'Annulé'],
        datasets: [{
          label: 'Expedition',
          data: [
            statusCounts['confirmé'],
            statusCounts['planification'],
            statusCounts['en transit'],
            statusCounts['delivré'],
            statusCounts['annulé'],
          ],
          backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336', '#f5e332']
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

      new Chart('expeditionStatusChart', config);
    }



    countTransportType(): { [key: string]: number } {
      const typeCounts: { [key: string]: number } = {};

      this.Transport.forEach(transport => {
        const type = transport.type;
        if (type in typeCounts) {
          typeCounts[type]++;
        } else {
          typeCounts[type] = 1;
        }
      });

      return typeCounts;
    }

    createTransportTypeChart(): void {
      const typeCounts = this.countTransportType();

      const data = {
        labels: Object.keys(typeCounts),
        datasets: [{
          label: 'Transport Types',
          data: Object.values(typeCounts),
          backgroundColor: [
            '#4caf50', '#ff9800', '#2196f3', '#f44336',
            '#9c27b0', '#00bcd4', '#cddc39', '#ffeb3b'
          ] // Assurez-vous d'avoir assez de couleurs pour vos types de transport
        }]
      };

      const config: ChartConfiguration<'pie'> = {
        type: 'pie', // Changer le type à 'pie'
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top', // Position de la légende
            },
            tooltip: {
              callbacks: {
                label: function(context: TooltipItem<'pie'>) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.raw !== null) {
                    label += context.raw;
                  }
                  return label;
                }
              }
            }
          }
        }
      };

      new Chart('TransportTypeChart', config);
    }

    countReservationStatus(): { [key: string]: number } {
      const statusCounts: { [key: string]: number } = {
        confirmed: 0,
        used: 0,
        delayed: 0,
        cancelled: 0
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
        labels: ['Confirmed', 'Used', 'Delayed', 'Cancelled'],
        datasets: [{
          label: 'Transport',
          data: [
            statusCounts['confirmed'],
            statusCounts['used'],
            statusCounts['delayed'],
            statusCounts['cancelled']
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



    //Marchandise graphe:



    countMerchandiseStatus(): { [key: string]: number } {
      const StatusCounts: { [key: string]: number } = {};

      this.Merchandise.forEach(merchandise => {
        const status = merchandise.status;
        if (status in StatusCounts) {
          StatusCounts[status]++;
        } else {
          StatusCounts[status] = 1;
        }
      });

      return StatusCounts;
    }

    createMerchandiseStatusChart(): void {
      const StatusCounts = this.countMerchandiseStatus();

      const data = {
        labels: Object.keys(StatusCounts),
        datasets: [{
          label: 'Merchandises Status',
          data: Object.values(StatusCounts),
          backgroundColor: [
            '#4caf50', '#ff9800', '#2196f3', '#f44336',
            '#9c27b0', '#00bcd4', '#cddc39', '#ffeb3b'
          ] // Assurez-vous d'avoir assez de couleurs pour vos types de transport
        }]
      };

      const config: ChartConfiguration<'pie'> = {
        type: 'pie', // Changer le type à 'pie'
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top', // Position de la légende
            },
            tooltip: {
              callbacks: {
                label: function(context: TooltipItem<'pie'>) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.raw !== null) {
                    label += context.raw;
                  }
                  return label;
                }
              }
            }
          }
        }
      };

      new Chart('MerchandiseStatusChart', config);
    }



    InfoCard() : void {

      const transportChange = this.ChangeValue(this.Transport, "yesterday");
      const expeditionChange = this.ChangeValue(this.Expedition, "yesterday");
      const merchandiseChange = this.ChangeValue(this.Merchandise, "yesterday");
      const reservationChange = this.ChangeValue(this.Reservation, "yesterday");
      const deliveryChange = this.ChangeValue(this.CompletedDelivery, "last month");

        this.cards = [
          {
            title: "Réservations",
            value: this.Reservation.length,
            change: `${reservationChange >= 0 ? '+' : '-'}${Math.abs(reservationChange)}%`,
            changeType: reservationChange >= 0 ? "success" : "danger",
            comparison: "yesterday",
            icon: "assignment",
            color: "success",
          },
          {
            title: "Expéditions",
            value: this.Expedition.length,
            change: `${expeditionChange >= 0 ? '+' : '-'}${Math.abs(expeditionChange)}%`,
            changeType: expeditionChange >= 0 ? "success" : "danger",
            comparison: "yesterday",
            icon: "local_shipping",
            color: "info"
          },
          {
            title: "Marchandises",
            value: this.Merchandise.length,
            change: `${merchandiseChange >= 0 ? '+' : '-'}${Math.abs(merchandiseChange)}%`,
            changeType: merchandiseChange >= 0 ? "success" : "danger",
            comparison: "yesterday",
            icon: "inventory_2",
            color: "dark"
          },
          {
            title: "Livraisons Complétées",
            value: this.CompletedDelivery.length,
            change: `${deliveryChange >= 0 ? '+' : '-'}${Math.abs(deliveryChange)}%`,
            changeType: deliveryChange >= 0 ? "success" : "danger",
            comparison: "last month",
            icon: "done_all",
            color: "primary"
          }
        ];
      }

      ChangeValue(Table: any[], comparison: string): number {
        // Convertir les éléments en dates
        const currentDate = new Date();
        let startDate: Date;

        switch (comparison) {
          case "yesterday":
            startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - 1);
            break;

          case "last week":
            startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - 7);
            break;

          case "last month":
            startDate = new Date(currentDate);
            startDate.setMonth(currentDate.getMonth() - 1);
            break;

          case "last year":
            startDate = new Date(currentDate);
            startDate.setFullYear(currentDate.getFullYear() - 1);
            break;

          default:
            throw new Error("Invalid comparison type");
        }

        // Filtrer les éléments selon le critère de comparison
        const filteredTable = Table.filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate >= startDate && itemDate <= currentDate;
        });

        // Calculer la fréquence de changement des valeurs
        const frequency = filteredTable.length;

        return frequency;
      }




    cards = [
      {
        title: "Reservation",
        value: this.Reservation.length,
        change: "",
        changeType: "",
        comparison: "yesterday",
        icon: "local_shipping",
        color: "success"
      },
      {
        title: "Expeditions",
        value: this.Expedition.length,
        change: "",
        changeType: "",
        comparison: "yesterday",
        icon: "flight_takeoff", // Updated icon
        color: "info"
      },
      {
        title: "Marchandise",
        value: this.Merchandise.length,
        change: "",
        changeType: "",
        comparison: "yesterday",
        icon: "local_shipping",
        color: "success"
      },
      {
        title: "Livraisons Complétées",
        value: this.CompletedDelivery.length,
        change: "",
        changeType: "",
        comparison: "last month",
        icon: "done_all",
        color: "primary"
      }


    ];
  }
