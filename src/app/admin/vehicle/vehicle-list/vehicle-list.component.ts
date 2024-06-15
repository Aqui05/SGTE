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

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.dataService.getVehicles().subscribe(
      (data) => {
        this.vehicles = data.data;
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
}
