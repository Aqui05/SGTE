import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit, AfterViewInit {
  vehicle: any;
  @ViewChild('threeCanvas') threeCanvas!: ElementRef;



  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.dataService.getVehicle(Number(id)).subscribe(
      (data) => {
        this.vehicle = data.data;
        // Load the 3D model once the vehicle data is available
        this.load3DModel(this.vehicle.model_3d_link);
      },
      (error) => {
        console.error('Erreur lors de la récupération du véhicule:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    // Initialize the 3D scene here if the vehicle data is already available
    if (this.vehicle) {
      this.load3DModel(this.vehicle.model_3d_link);
    }
  }

  load3DModel(modelUrl: string): void {
    if (!modelUrl) {
      console.error('Model URL is not available');
      return;
    }

    const canvas = this.threeCanvas.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(width, height);

    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.position.set(0, 0, 0);

      const animate = () => {
        requestAnimationFrame(animate);
        gltf.scene.rotation.y += 0.01; // Optional: rotate the model
        renderer.render(scene, camera);
      };
      animate();
    }, undefined, (error) => {
      console.error('An error happened', error);
    });
  }

  editVehicle(id: number): void {
    this.router.navigate([`/vehicle/edit/${id}`]);
  }

  deleteVehicle(id: number): void {
    this.dataService.deleteVehicle(id).subscribe(
      (response) => {
        this.router.navigate(['/vehicles']);
      },
      (error) => {
        console.error('Erreur lors de la suppression du véhicule:', error);
      }
    );
  }
}



