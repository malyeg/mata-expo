import { Profile } from "@/models/Profile.model";
import { IMessage } from "react-native-gifted-chat";
import { DataSearchable, Entity } from "../types/DataTypes";
import { PublicUser } from "./authApi";
import { DatabaseApi } from "./DatabaseApi";
import profilesApi from "./profileApi";

export interface ChatUser {
  _id: string;
  name?: string;
  avatar?: string;
}
export interface Delivery {
  userId: string;
  received?: boolean;
  pending?: boolean;
  sent?: boolean;
}
export interface Message extends DataSearchable, Entity {
  id: string;
  dealId: string;
  text: string;
  image?: string;
  messageType: string;
  video?: string;
  audio?: string;
  system?: boolean;
  deliveries?: Delivery[];
  user?: PublicUser;
}

class MessagesApi extends DatabaseApi<Message> {
  constructor() {
    super("messages");
  }

  toMessage(dealId: string, profile: Profile, chatMessage: IMessage) {
    // const timestamp = (chatMessage?.timestamp as any)?.toDate();
    const message: Message = {
      ...chatMessage,
      id: chatMessage._id.toString(),
      userId: chatMessage.user._id?.toString(),
      timestamp:
        chatMessage.createdAt instanceof Date
          ? chatMessage.createdAt
          : new Date(chatMessage.createdAt),
      dealId,
      user: {
        email: profile.email,
        id: profile.id,
        name: profile.fullName ?? profilesApi.getName(profile),
      },
    };
    return message;
  }
}

const messagesApi = new MessagesApi();

export default messagesApi;
