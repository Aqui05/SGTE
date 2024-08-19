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
  selector: 'app-expedition-list',
  templateUrl: './expedition-list.component.html',
  styleUrls: ['./expedition-list.component.css']
})
export class ExpeditionListComponent implements OnInit {
  expeditions: ExpeditionData[] = [];
  searchTerm: string = '';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadExpeditions();
  }

  getStatusType(status: string): string {
    switch (status) {
      case 'confirmé':
        return 'success';
      case 'planification':
        return 'yellow';
      case 'en transit':
        return 'processing';
      case 'delivré':
        return 'purple';
      case 'annulé':
        return 'error';
      default:
        return 'default';
    }
  }

  getFilteredExpeditions() {
    return this.expeditions
      .filter(m => m.status !== 'delivré' && m.status !== 'annulé')
      .filter(m => this.searchTerm === '' ||
                    m.expedition_number.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    m.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    m.origin.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    m.destination.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .sort((a, b) => this.getStatusPriority(a.status) - this.getStatusPriority(b.status));
  }

  getStatusPriority(status: string): number {
    switch (status) {
      case 'confirmé':
        return 1;
      case 'planification':
        return 2;
      case 'en transit':
        return 3;
      case 'delivré':
        return 4;
      case 'annulé':
        return 5;
      default:
        return 6;
    }
  }

  loadExpeditions(): void {
    this.dataService.getExpeditionsList().subscribe(
      (data) => {
        this.expeditions = data.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des expéditions:', error);
      }
    );
  }

  viewDetails(id: number): void {
    this.router.navigate([`admin/expedition/details/${id}`]);
  }

  edit(id: number): void {
    this.router.navigate([`admin/expedition/edit/${id}`]);
  }

  cancel(id: number): void {
    this.dataService.deleteExpedition(id, this.expeditions).subscribe(
      (response) => {
        this.loadExpeditions();
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'expédition:', error);
      }
    );
  }

  addExpedition(): void {
    this.router.navigate([`/admin/expedition/create`]);
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
