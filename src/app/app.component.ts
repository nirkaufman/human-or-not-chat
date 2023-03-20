import {Component, inject, OnInit} from '@angular/core';
import {ApiService} from "./services/api.service";
import {GameService} from "./services/game.service";

@Component({
  selector: 'app-root',
  template: `
      <app-loading-chat *ngIf="gameService.chatLoading$ | async"></app-loading-chat>

      <div *ngIf="!(gameService.chatLoading$ | async)">
          
          <div class="d-flex justify-content-between px-lg-4 px-2 pt-lg-3 pt-2 sticky-top bg-white">
              <p class="pe-0 ff-redaction-35 fw-400 fs-20">Human or Not</p>
              <p class="pe-0 ff-satoshi-variable fw-700 fs-20" >
                  {{ gameService.timeLeft$ | async}}
              </p>
          </div>
          
          <div class="container">
              <div class="row">
                  <div class="col-lg-8 col-sm-10 mx-auto">
                      <chat-feed></chat-feed>
                      <decision-box *ngIf="gameService.gameEnded$ | async"/>
                  </div>
              </div>
          </div>
      </div>
  `,
})
export class AppComponent implements OnInit {
  apiService = inject(ApiService);
  gameService = inject(GameService);

  ngOnInit(): void {
    this.apiService.startChat();
  }
}
