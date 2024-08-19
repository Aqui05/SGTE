import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

interface ExpeditionData {
  id: number;
  expedition_number: string;
  type: string;
  origin: string;
  destination: string;
  date_expedition: string;
  date_livraison_prevue: string;
  status: string;
}

@Component({
  selector: 'app-expedition-history',
  templateUrl: './expedition-history.component.html',
  styleUrls: ['./expedition-history.component.css']
})
export class ExpeditionHistoryComponent implements OnInit {
  Expedition: ExpeditionData[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.InfoExpedition();
  }

  InfoExpedition(): void {
    this.dataService.getUserExpeditions().subscribe(
      (response) => {
        this.Expedition = response.data;
        console.log('Expedition:', response.data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des expéditions:', error);
      }
    );
  }

  getStatusType(status: string): string {
    switch (status) {
      case 'confirmé': return 'success';
      case 'planification': return 'yellow';
      case 'en transit': return 'processing';
      case 'delivré': return 'purple';
      case 'annulé': return 'error';
      default: return 'default';
    }
  }

  getFilteredExpeditions() {
    return this.Expedition.filter(m => m.status !== 'delivré' && m.status !== 'annulé');
  }

  viewDetails(id: number): void {
    this.router.navigate([`${id}`]);
  }

  // Fonctions de tri
  sortFnNumber: NzTableSortFn<ExpeditionData> = (a, b) => a.expedition_number.localeCompare(b.expedition_number);
  sortFnDate: NzTableSortFn<ExpeditionData> = (a, b) => new Date(a.date_expedition).getTime() - new Date(b.date_expedition).getTime();

  // Fonctions de filtrage
  filterFnStatus: NzTableFilterFn<ExpeditionData> = (list: string[], item: ExpeditionData) => list.some(status => item.status.indexOf(status) !== -1);
  filterFnType: NzTableFilterFn<ExpeditionData> = (list: string[], item: ExpeditionData) => list.some(type => item.type.indexOf(type) !== -1);

  // Listes de filtres
  listOfStatusFilter: NzTableFilterList = [
    { text: 'Confirmé', value: 'confirmé' },
    { text: 'Planification', value: 'planification' },
    { text: 'En transit', value: 'en transit' },
    { text: 'Délivré', value: 'délivré' },
    { text: 'Annulé', value: 'annulé' },
  ];

  listOfTypeFilter: NzTableFilterList = [
    { text: 'Maritime', value: 'maritime' },
    { text: 'Routier', value: 'routier' },
    { text: 'Aérien', value: 'aérien' },
    { text: 'Ferroviaire', value: 'ferroviaire' },
  ];
}
