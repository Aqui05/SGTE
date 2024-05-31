import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  responseData: any;

  @ViewChild('modalTitle') modalTitle: TemplateRef<any> | undefined;
  @ViewChild('loginTitle') loginTitle: TemplateRef<any> | undefined;



  constructor(private route: ActivatedRoute, private modalService: NzModalService) {}


  ngOnInit() {

  }

  title = 'Home'

  isVisible = false;
  isOkLoading = false;

  showModalLogin(): void {
    this.isVisible = true;

    this.modalService.create({
      nzTitle: this.modalTitle,
      nzContent: LoginComponent,
      nzFooter: null,
      nzOnCancel: () => this.handleCancel(),
      nzOnOk: () => this.handleOk(),
    });
  }


  showModalRegister(): void {
    this.isVisible = true;

    this.modalService.create({
      nzTitle: this.loginTitle,
      nzContent: RegisterComponent,
      nzFooter: null,
      nzOnCancel: () => this.handleCancel(),
      nzOnOk: () => this.handleOk(),
    });
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
