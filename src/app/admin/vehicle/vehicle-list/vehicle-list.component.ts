import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

interface VehicleData {
  id: number;
  model: string;
  brand: string;
  type: string;
  license_plate: string;
  model_3D_link: string;
  seats: number;
  available: boolean;
}

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  vehicles: VehicleData[] = [];
  searchTerm: string = '';
  filteredVehicles: any[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.dataService.getVehicles().subscribe(
      (data) => {
        this.vehicles = data.data;
        this.filteredVehicles = this.vehicles; // Initial filtering with all data
      },
      (error) => {
        console.error('Erreur lors de la récupération des véhicules:', error);
      }
    );
  }

  viewDetails(id: number): void {
    this.router.navigate([`admin/vehicle/details/${id}`]);
  }

  editVehicle(id: number): void {
    this.router.navigate([`admin/vehicle/edit/${id}`]);
  }

  addVehicle(): void {
    this.router.navigate([`/admin/vehicle/create`]);
  }

  deleteVehicle(id: number): void {
    this.dataService.deleteVehicle(id).subscribe(
      (response) => {
        this.loadVehicles();
      },
      (error) => {
        console.error('Erreur lors de la suppression du véhicule:', error);
      }
    );
  }

  searchVehicles(): void {
    if (this.searchTerm) {
      this.filteredVehicles = this.vehicles.filter(vehicle =>
        vehicle.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.license_plate.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredVehicles = this.vehicles; // Show all if no search term
    }
  }

  // Fonctions de tri
  sortFnBrand: NzTableSortFn<VehicleData> = (a, b) => a.brand.localeCompare(b.brand);
  sortFnModel: NzTableSortFn<VehicleData> = (a, b) => a.model.localeCompare(b.model);
  sortFnLicense: NzTableSortFn<VehicleData> = (a, b) => a.license_plate.localeCompare(b.license_plate);
  sortFnSeats: NzTableSortFn<VehicleData> = (a, b) => a.seats - b.seats;

  // Fonctions de filtrage
  filterFnStatus: NzTableFilterFn<VehicleData> = (list: boolean[], item: VehicleData) => list.includes(item.available);
  filterFnType: NzTableFilterFn<VehicleData> = (list: string[], item: VehicleData) => list.some(type => item.type.indexOf(type) !== -1);

  // Listes de filtres
  listOfStatusFilter: NzTableFilterList = [
    { text: 'Disponible', value: 1 },
    { text: 'Non disponible', value: 0 },
  ];

  listOfTypeFilter: NzTableFilterList = [
    { text: 'Maritime', value: 'maritime' },
    { text: 'Routier', value: 'routier' },
    { text: 'Aérien', value: 'aérien' },
    { text: 'Ferroviaire', value: 'ferroviaire' },
  ];}
