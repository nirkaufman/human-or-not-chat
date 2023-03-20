import {Component, inject, Input, OnInit} from '@angular/core';
import {DisplayText, PartnerType, Sender, Status} from "../config/enums";
import {ApiService} from "../services/api.service";
import {GameService} from "../services/game.service";

interface Results {
  partnerType: PartnerType,
  subText: string
  status: Status,
  heading: string
}

@Component({
  selector: 'decision-box',
  template: `
      <div *ngIf="results else resultsTmpl" class="text-center mt-5">
          <div class="d-flex flex-column justify-content-center align-items-center mt-5">

              <p class="mb-0" [ngStyle]="{'font-size': '65px'}"> {{ icon }} </p>
              <p class="mb-1">{{ status }}</p>

              <h2>{{ results.heading }}</h2>
              <p>{{ results.subText }}</p>
              <button (click)="apiService.startChat()" class="btn btn-outline-dark btn-lg rounded-0">{{DisplayText.TryAgain}}</button>
          </div>
      </div>

      <ng-template #resultsTmpl>
          <div class="text-center mt-5">
              <div>
                  <strong>Who did you talk to?</strong>
              </div>
              <div class="d-flex flex-lg-row flex-column mt-3">
                  <button class="flex-fill btn btn-lg btn-outline-dark mx-lg-2 mx-sm-0 my-2 rounded-0"
                          (click)="guess(PartnerType.Human)">👤 Human
                  </button>
                  <button class="flex-fill btn btn-lg btn-outline-dark mx-lg-2 mx-sm-0 my-2 rounded-0"
                          (click)="guess(PartnerType.Bot)">🤖 AI bot
                  </button>
              </div>
          </div>
      </ng-template>
  `,
})
export class DecisionBoxComponent {
  apiService = inject(ApiService);
  gameService = inject(GameService);

  DisplayText = DisplayText;
  PartnerType = PartnerType;

  results: Results;

  get icon() {
    return this.results.partnerType === PartnerType.Bot ? '🤖' : '👤';
  }

  get status() {
    return this.results.status === Status.Correct ? DisplayText.SpotOn : DisplayText.Wrong;
  }

  async guess(userGuess: PartnerType) {
    await this.apiService.guess(userGuess);

    this.gameService.partnerType$.subscribe((partnerType) => {

      // User guessed successfully
      if (userGuess === partnerType) {

        if (partnerType === PartnerType.Bot) {
          this.results = {
            status: Status.Correct,
            partnerType: PartnerType.Bot,
            heading: 'You just talked with an AI bot',
            subText: 'You’re a professional bot hunter!'
          }
        }

        if (partnerType === PartnerType.Human) {
          this.results = {
            status: Status.Correct,
            partnerType: PartnerType.Human,
            heading: 'You just talked to a fellow human',
            subText: 'It takes one to know one!'
          }

        }
      }

      if (userGuess !== partnerType) {

        if (partnerType === PartnerType.Bot) {
          this.results = {
            status: Status.Incorrect,
            partnerType: PartnerType.Bot,
            heading: 'You just talked to an AI bot',
            subText: 'Singularity is just around the corner?'
          }
        }

        if (partnerType === PartnerType.Human) {
          this.results = {
            status: Status.Incorrect,
            partnerType: PartnerType.Human,
            heading: 'You just talked to a fellow human',
            subText: 'They might find this insulting…'
          }
        }
      }
    })
  }
}
