import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {ApiService} from "../services/api.service";
import {UserType} from "../config/enums";

@Component({
  selector: 'chat-feed',
  template: `
      <div #scrollContainer *ngFor="let message of apiService.chatFeed$ | async">
          <user-entry *ngIf="message.user === UserType.Me" [message]="message"/>
          <api-entry *ngIf="message.user === UserType.Other" [message]="message"/>
          <notification-entry *ngIf="message.user === UserType.System" [message]="message.text || ''"/>
      </div>
  `,
})
export class ChatFeedComponent {
  @ViewChild('scrollContainer') scrollContainer: ElementRef;

  apiService = inject(ApiService)
  UserType = UserType

  scrollToBottom() {
    if (this.scrollContainer.nativeElement) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
