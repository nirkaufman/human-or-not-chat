import {InjectionToken} from "@angular/core";

export interface ChatConfigService {
  GAME_TIMEOUT_IN_MINUTES: number,
  USER_PROMPT_TIMEOUT_IN_MS: number
}

const defaultConfig = {
  GAME_TIMEOUT_IN_MINUTES: 2,
  USER_PROMPT_TIMEOUT_IN_MS: 20000
}

export const ChatConfigService = new InjectionToken<ChatConfigService>('ChatConfigService', {
  providedIn: 'root',
  factory: () => defaultConfig
});


