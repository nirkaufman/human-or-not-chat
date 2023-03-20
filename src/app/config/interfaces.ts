import {PartnerType, UserType} from "./enums";

export interface Message {
  user: UserType;
  text?: string;
  inProgress: boolean;
  created_at?: number;
}

export interface ChatMetaData {
  chat_id: string,
  user_id: string,
  created_at?: number,
  num_participants: number,
  is_my_turn: boolean,
  is_active: boolean,
  partner_type?: PartnerType,
}

export interface ChatApiResponse extends ChatMetaData {
  messages: Message[]
}
