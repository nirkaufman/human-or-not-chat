import {AfterViewInit, Component, inject, Input} from '@angular/core';
import {Message} from "../config/interfaces";
import {AnimationOptions} from "ngx-lottie";
import * as animationData from '../../assets/animation/typing.json';
import {ChatFeedComponent} from "./chat-feed.component";

@Component({
  selector: 'api-entry',
  template: `
      <div class="text-start my-3">
          <small *ngIf="message.inProgress" class="ff-satoshi-variable fw-700">Their Turn</small>
          <div class="d-flex justify-content-start">

              <div class="d-flex align-items-end">
                  <img *ngIf="!message.inProgress" src='../../assets/images/q-mark.svg' alt='question mark'
                       class='me-1'/>
                  <div class="d-flex flex-nowrap align-items-start p-3 py-auto"
                       [ngStyle]="{'background-color': '#EEEEEE'}">

                      <div class="my-auto ff-satoshi-variable fw-500">{{message.text}}</div>

                      <ng-container *ngIf="message.inProgress">
                          <ng-lottie [options]="options" width="24px" height="24px" class="me-1"/>
                          <span class="text-muted ff-satoshi-variable ">Typing...</span>
                      </ng-container>
                  </div>
              </div>
          </div>
      </div>
  `,
})
export class ApiEntryComponent implements AfterViewInit {
  @Input() message: Message;

  chatFeedComponent = inject(ChatFeedComponent);

  options: AnimationOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    }
  };

  ngAfterViewInit(): void {
    this.chatFeedComponent.scrollToBottom();
  }


}
