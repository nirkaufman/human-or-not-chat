import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import axios from "axios";
import {PartnerType, Sender, UserType} from "../config/enums";
import {API_BASE} from "../config/constants";
import {GameService} from "./game.service";
import {ChatApiResponse, ChatMetaData, Message} from "../config/interfaces";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private gameService = inject(GameService)

  private messages: BehaviorSubject<Message[]>;
  private chatMetaData: BehaviorSubject<ChatMetaData>;

  chatFeed$: Observable<Message[]>;
  chatMetaData$: Observable<ChatMetaData>;

  constructor() {
    this.messages = new BehaviorSubject<Message[]>([]);
    this.chatMetaData = new BehaviorSubject<ChatMetaData>(null as any);

    this.chatFeed$ = this.messages.asObservable();
    this.chatMetaData$ = this.chatMetaData.asObservable();
  }

  async startChat() {
    this.messages.next([]);
    this.gameService.initGame();

    const response = await axios.post<ChatApiResponse>(
        API_BASE + '/', {}
    );

    this.gameService.startGameTimer();

    this.chatMetaData.next({
      chat_id: response.data.chat_id,
      user_id: response.data.user_id,
      num_participants: response.data.num_participants,
      is_my_turn: response.data.is_my_turn,
      is_active: response.data.is_active,
    });

    const notificationMessage: Message = {
      user: UserType.System,
      text: 'Conversion begins',
      inProgress: false,
    }

    // First message depends on the response from the API
    const newMessage: Message = {
      user: response.data.is_my_turn ? UserType.Me : UserType.Other,
      created_at: response.data.created_at,
      inProgress: true,
    }

    this.gameService.setChatLoading(false);
    this.messages.next([...this.messages.value, notificationMessage, newMessage]);

    if (!response.data.is_my_turn) {
      const {chat_id, user_id} = response.data;
      await this.waitForUpdate(chat_id, user_id);
    }
  }

  // this method should be called only once, when the chat starts for the first time
  async waitForUpdate(chatId: string, userId: string) {
    const response = await axios.put<ChatApiResponse>(
        `${API_BASE}/${chatId}/wait-message`,
        {
          user_id: userId
        });

    const currentMessages = this.messages.value;

    const currentMessage = {
      ...currentMessages[1],
      inProgress: false,
      text: response.data.messages[0].text
    };

    this.messages.next([currentMessage, {
      user: UserType.Me,
      inProgress: true,
    }]);
  }

  /**
   * Sends a message to the chat.
   * Empty value means that the user wants to end the chat.
   * In this case, the game is ended.
   */
  async sendMessage(messageValue: string) {
    const trimmedMessage = messageValue.trim();
    let currentMessages = this.messages.value;

    // create an updated version of the latest message
    const currentMessage = {
      ...currentMessages[currentMessages.length - 1],
      inProgress: false,
      text: messageValue
    };

    // replace the latest message with the updated version
    currentMessages.splice(currentMessages.length - 1, 1, currentMessage);

    // notify about the change
    this.messages.next([...currentMessages ]);


    if(trimmedMessage.length !== 0) {
      this.messages.next([...currentMessages, {
        user: UserType.Other,
        inProgress: true,
      }])
    }

    // send the message to the server
    const response = await axios.put<ChatApiResponse>(
        `${API_BASE}/${this.chatMetaData.value.chat_id}/send-message`,
        {
          user_id: this.chatMetaData.value.user_id,
          text: trimmedMessage
        }
    );

    // If the message was empty, the server will terminate the chat
    if (response.data.is_active === false) {
      const notificationMessages: Message[] = [];

      if (response.data.is_my_turn === false) {
        notificationMessages.push({
          user: UserType.System,
          text: 'Conversation ended',
          inProgress: false,
        })
      }

      if (response.data.is_my_turn === true) {
        notificationMessages.push({
          user: UserType.System,
          text: 'The other user ended the conversation',
          inProgress: false,
        })

        notificationMessages.push({
          user: UserType.System,
          text: 'Conversation ended',
          inProgress: false,
        })
      }

      this.messages.next([...this.messages.value, ...notificationMessages]);
      this.gameService.endGame();

      return;
    }

    // If the message was not empty, the chat continues
    currentMessages = this.messages.value;

    currentMessages.splice(currentMessages.length - 1, 1, {
      user: UserType.Other,
      inProgress: false,
      text: response.data.messages[response.data.messages.length - 1].text,
      created_at: response.data.messages[response.data.messages.length - 1].created_at
    });

    this.messages.next([...currentMessages, {
      user: UserType.Me,
      inProgress: true,
    }]);

    this.chatMetaData.next({
      ...this.chatMetaData.value,
      is_active: response.data.is_active,
    });
  }

  async guess(partnerType: PartnerType) {
    const response = await axios.put<ChatApiResponse>(
        `${API_BASE}/${this.chatMetaData.value.chat_id}/guess`,
        {
          user_id: this.chatMetaData.value.user_id,
          partner_type: partnerType
        }
    );

    this.gameService.setPartnerType(response.data.partner_type);

    this.chatMetaData.next({
      ...response.data,
    })
  }
}
