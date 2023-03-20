import {AfterViewInit, Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {ApiService} from "../services/api.service";
import {AnimationOptions} from "ngx-lottie";
import * as jsonData from '../../assets/animation/send.json';
import {ChatConfigService} from "../services/config.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {Message} from "../config/interfaces";
import {GameService} from "../services/game.service";
import {ChatFeedComponent} from "./chat-feed.component";

@Component({
  selector: 'user-entry',
  animations: [
    trigger(
        'inOutAnimation',
        [
          transition(
              ':enter',
              [
                style({ opacity: 0 }),
                animate('200ms ease-out',
                    style({ opacity: 1 }))
              ]
          )
        ]
    )
  ],
  template: `
      <div class="text-end my-3">
          <small *ngIf="message.inProgress" class="ff-satoshi-variable fw-700">Your Turn</small>
          <div class="d-flex justify-content-end">

              <div *ngIf="!message.inProgress else messageReady" [@inOutAnimation]
                   class="d-flex flex-nowrap align-items-start p-3 py-auto" [ngStyle]="{'background-color': '#222222'}">
                  <p class="my-auto ff-satoshi-variable fw-500 text-white">{{message.text}}</p>
              </div>

              <ng-template #messageReady>
                  <div class="d-flex flex-row justify-content-center align-items-center pe-1"
                       [ngStyle]="{border: '2px solid black'}">

                      <div *ngIf="!dirtyUserPrompt" [@inOutAnimation] class="ms-2" [ngStyle]="{width: '12px', height: '22px', backgroundColor: '#222222'}"></div>
                      
                      <input [ngStyle]="{border: 'none', outline: 'none'}" 
                             #userPrompt 
                             [autofocus]="true"
                             (keydown)="setDirtyUserPrompt()"
                             (keydown.enter)="sendMessage()"
                             [readOnly]="gameService.gameEnded$ | async" type="text" class="p-2 border-1" />
                      
                      <ng-lottie *ngIf="!(gameService.gameEnded$ | async)"
                                 [ngStyle]="{cursor: 'pointer', margin: '5px'}"
                                 (click)="sendMessage()"
                                 [options]="options"
                                 height="30px" 
                                 width="30px"/>
                  </div>
              </ng-template>

          </div>
      </div>
  `,
  styles:[`
    input {
        caret-shape: underscore;
    }
  `]
})
export class UserEntryComponent implements AfterViewInit {
  @Input() message: Message;
  @ViewChild('userPrompt') userPrompt: ElementRef;

  private timerId: any;

  apiService = inject(ApiService);
  gameService = inject(GameService);
  CHAT_CONFIG = inject(ChatConfigService);
  chatFeedComponent =  inject(ChatFeedComponent);

  dirtyUserPrompt = false;

  options: AnimationOptions = {
    loop: false,
    autoplay: true,
    animationData:  jsonData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  ngAfterViewInit(): void {
    if(this.userPrompt?.nativeElement) {
      this.userPrompt.nativeElement.focus();
    }
    if(this.message.inProgress) {
      this.timerId = setTimeout(() => this.sendMessage('timer'), this.CHAT_CONFIG.USER_PROMPT_TIMEOUT_IN_MS);
    }
  }

  sendMessage(trigger?: string) {
    const valueFromInput = this.userPrompt.nativeElement.value.trim();

    if(valueFromInput.length === 0 && trigger !== 'timer') {
      this.userPrompt.nativeElement.focus();
      return;
    }

    this.apiService.sendMessage(this.userPrompt.nativeElement.value);
    this.chatFeedComponent.scrollToBottom()
    clearTimeout(this.timerId);
  }

  setDirtyUserPrompt() {
    this.dirtyUserPrompt = true;
  }
}
