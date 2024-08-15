import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  vehicles: any[] = [];
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
}
