import {Component, Input} from '@angular/core';

@Component({
  selector: 'notification-entry',
  template: `
      <div class="ff-satoshi-variable fw-500 text-center my-3">
          <small class="text-muted">{{ message }}</small>
      </div>
  `,
})
export class NotificationEntryComponent {
  @Input() message: string;
}
