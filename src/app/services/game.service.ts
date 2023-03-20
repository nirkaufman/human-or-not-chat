import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {ChatConfigService} from "./config.service";
import {PartnerType} from "../config/enums";

@Injectable({providedIn: 'root'})
export class GameService {
  private CHAT_CONFIG = inject(ChatConfigService);

  private chatLoading: BehaviorSubject<boolean>;
  private gameEnded: BehaviorSubject<boolean>;
  private timeLeft: BehaviorSubject<string>;
  private partnerType: BehaviorSubject<PartnerType>;

  private gameTimer: number;

  chatLoading$: Observable<boolean>;
  gameEnded$: Observable<boolean>;
  timeLeft$: Observable<string>;
  partnerType$: Observable<PartnerType>;

  constructor() {
    this.initGame();
  }

  startGameTimer() {
    const minutes = this.CHAT_CONFIG.GAME_TIMEOUT_IN_MINUTES;

    let seconds: number = minutes * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minutes < 10 ? '0' : '';

    this.gameTimer = setInterval(() => {
      seconds--;

      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) textSec = '0' + statSec;
      else textSec = statSec;

      this.timeLeft.next(`${prefix}${Math.floor(seconds / 60)}:${textSec}`);

      if (seconds == 0) {
        console.log('finished');
        clearInterval(this.gameTimer);
      }
    }, 1000);
  }

  endGame() {
    clearInterval(this.gameTimer);
    this.gameEnded.next(true);
  }

  setChatLoading(loading: boolean) {
    this.chatLoading.next(loading);
  }

  setPartnerType(partnerType: PartnerType | undefined) {
    if (partnerType === undefined) {
      this.partnerType.next(PartnerType.Unkonwn);
    } else {
      this.partnerType.next(partnerType);
    }
  }

  initGame() {
    this.chatLoading = new BehaviorSubject<boolean>(true);
    this.gameEnded = new BehaviorSubject<boolean>(false);
    this.timeLeft = new BehaviorSubject<string>('02:00');
    this.partnerType = new BehaviorSubject<PartnerType>(PartnerType.Unkonwn);

    this.chatLoading$ = this.chatLoading.asObservable();
    this.gameEnded$ = this.gameEnded.asObservable();
    this.timeLeft$ = this.timeLeft.asObservable();
    this.partnerType$ = this.partnerType.asObservable();
  }
}
