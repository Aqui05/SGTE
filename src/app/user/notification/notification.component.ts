import { Component, TemplateRef, ViewChild } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationUserComponent {
  @ViewChild(TemplateRef, { static: false }) template?: TemplateRef<{}>;

  ninja(): void {
    const fruits = [
      { name: 'Apple', color: 'red' },
      { name: 'Orange', color: 'orange' },
      { name: 'Watermelon', color: 'green' }
    ];

    fruits.forEach(fruit => {
      this.notificationService.template(this.template!, { nzData: fruit });
    });
  }

  constructor(private notificationService: NzNotificationService) {}
}
