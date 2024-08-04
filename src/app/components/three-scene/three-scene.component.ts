import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-scene',
  templateUrl: './three-scene.component.html',
  styleUrls: ['./three-scene.component.css']
})
export class ThreeSceneComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;

  constructor() {}

  ngOnInit(): void {
    this.initThreeJs();
  }

  ngAfterViewInit(): void {
    this.renderer.setSize(this.rendererContainer.nativeElement.clientWidth, this.rendererContainer.nativeElement.clientHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.animate();
  }

  private initThreeJs(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.camera.position.z = 5;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  /*
  private initThreeJs(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.camera.position.z = 5;

    const geometry = new THREE.BoxGeometry();
    const texture = new THREE.TextureLoader().load('path/to/texture.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    const light = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(light);

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }*/

}
