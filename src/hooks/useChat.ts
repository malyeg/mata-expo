import { useMemo } from "react";
import { IMessage } from "react-native-gifted-chat";
import { Deal } from "../api/dealsApi";
import messagesApi, { Delivery, Message } from "../api/messagesApi";
import profilesApi from "../api/profileApi";
import useAuth from "./useAuth";

const useChat = () => {
  const { profile } = useAuth();
  const context = useMemo(
    () => ({
      addMessage: async (message: Message, deal: Deal) => {
        // TODO move to firebase function
        message.deliveries = [
          {
            userId: profile.id,
            received: true,
            sent: true,
          },
          {
            userId: profile.id === deal.userId ? deal.item.userId : deal.userId,
            received: false,
          },
        ];
        console.log(profile);
        if (message.user) {
          const updatedMessage: Message = {
            ...message,
            user: {
              ...message.user,
              displayName: profile.fullName ?? profile.email,
            },
          };
          await messagesApi.set(message.id, updatedMessage);
          return message;
        }
      },
      toChatMessage: (message: Message) => {
        // Convert Firestore Timestamp to Date if needed
        let createdAt: Date;
        if (message.timestamp) {
          if (message.timestamp instanceof Date) {
            createdAt = message.timestamp;
          } else if (
            typeof message.timestamp === "object" &&
            "toDate" in message.timestamp
          ) {
            // Firestore Timestamp object
            createdAt = (message.timestamp as any).toDate();
          } else {
            createdAt = new Date(message.timestamp);
          }
        } else {
          createdAt = new Date();
        }

        const newMessage: IMessage = {
          _id: message.id,
          text: message.text,
          user: {
            _id: message?.userId ?? message?.user?.id,
          },
          createdAt,
          system: message.system,
        };
        return newMessage;
      },
      toMessage: (chatMessage: IMessage, deal: Deal) => {
        const message: Message = {
          id: chatMessage._id.toString(),
          text: chatMessage.text,
          userId: profile.id,
          user: {
            id: profile.id,
            name: profile.name ?? profilesApi.getName(profile),
            email: profile.email,
          },
          dealId: deal.id,
          system: chatMessage.system,
          timestamp: new Date(chatMessage.createdAt),
        };
        return message;
      },
      updateMessagesRecieved: (messages: Message[]) => {
        const recievedMap = new Map<string, Partial<Message>>();

        messages.forEach(async (message) => {
          const delivery = message.deliveries?.find(
            (i) => i.userId === profile.id
          );
          if (!delivery || !delivery.received) {
            const deliveries: Delivery[] = message.deliveries
              ? [...message.deliveries]
              : [];
            const newDeliveries = deliveries.filter(
              (d) => d.userId !== profile.id
            );

            newDeliveries.push({
              ...delivery!,
              userId: profile.id,
              received: true,
            });
            recievedMap.set(message.id, {
              deliveries: newDeliveries,
            });
            try {
              return await messagesApi.update(message.id, {
                deliveries: newDeliveries,
              });
            } catch (error) {}
          }
        });
        // notificationsApi.updateDelivery(notification?.id);

        // return messagesApi.writeBatch.update(recievedMap);
      },

      getNonRecievedMessages: (messages: Message[]) => {
        const nonRecievedMessages = messages.filter((i) => {
          return !(
            !!i.deliveries &&
            i.deliveries.find(
              (x) => x.received === true && x.userId === profile.id
            )
          );
        });
        return nonRecievedMessages;
      },
    }),
    [profile]
  );
  return context;
};

export default useChat;
