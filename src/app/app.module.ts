import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ChatFeedComponent} from './components/chat-feed.component';
import {DecisionBoxComponent} from './components/decision-box.component';
import {UserEntryComponent} from './components/user-entry.component';
import {ApiEntryComponent} from './components/api-entry.component';
import {LottieModule} from "ngx-lottie";
import player from 'lottie-web';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoadingChatComponent} from './components/loading-chat.component';
import {NotificationEntryComponent} from './components/notification-entry.component';
import {ParseTimerPipe} from './pipes/parse-timer.pipe';
import {AutoResizeDirective} from "./directives/auto-resize/auto-resize.module";

// needed for AOT compilation
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    ChatFeedComponent,
    DecisionBoxComponent,
    UserEntryComponent,
    ApiEntryComponent,
    LoadingChatComponent,
    NotificationEntryComponent,
    ParseTimerPipe,
    AutoResizeDirective
  ],
  imports: [BrowserModule, LottieModule.forRoot({player: playerFactory}), BrowserAnimationsModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}
