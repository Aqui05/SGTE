import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { error } from 'jquery';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-merchandise-edit',
  templateUrl: './merchandise-edit.component.html',
  styleUrls: ['./merchandise-edit.component.css']
})
export class MerchandiseEditComponent implements OnInit {

  merchandiseId!: number ;
  Merchandise :any = {};
  submitError = false;
  submitErrorMessage = '';
  loading = false;
  merchandiseForm !:FormGroup


  constructor (
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: NzMessageService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.merchandiseId = this.route.snapshot.params['id'];
    this.loadMerchandiseData();


    this.merchandiseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: [''],
      quantity: [0, [Validators.required, Validators.min(1)]],
      weight: [0, [Validators.required, Validators.min(0)]],
      volume: [0, [Validators.required, Validators.min(0)]],
      numero_suivi: ['', Validators.required],
      depart: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  loadMerchandiseData(): void {
    this.dataService.getMerchandise(this.merchandiseId).subscribe(
      (response) => {
        this.Merchandise= response.data;
      },
      (error) => {
        console.error('Error loading vehicle:', error);
        this.msg.error('Error loading vehicle.');
      }
    )
  }

  submitForm ():void {
    this.loading = true;
    if (this.merchandiseForm.valid) {
      const merchandiseData = this.merchandiseForm.value;

      this.dataService.updateMerchandise(this.merchandiseId,merchandiseData).subscribe(
        (response) => {
          console.log('Merchandise has been updated successfully:', response);
          this.router.navigate(['/user/merchandise/list']);
        },
        (error) => {
          console.error('Error updating merchandise:', error);
          this.msg.error('Error updating merchandise ')
        },
      )
  }

  }

  generateTrackingNumber(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  setTrackingNumber(): void {
    const trackingNumber = this.generateTrackingNumber();
    this.merchandiseForm.patchValue({ numero_suivi: trackingNumber });
  }


}
