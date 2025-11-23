import dealsApi, { Deal } from "@/api/dealsApi";
import messagesApi, { Message } from "@/api/messagesApi";
import { useCollectionSnapshot } from "@/hooks/db/useCollectionSnapshot";
import useAuth from "@/hooks/useAuth";
import useChat from "@/hooks/useChat";
import { theme } from "@/styles/theme";
import React, { useCallback, useEffect, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  Bubble,
  Message as CMessage,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  SystemMessage,
} from "react-native-gifted-chat";
import { Icon } from "../core";

interface ChatProps {
  deal: Deal;
  style?: StyleProp<ViewStyle>;
  disableComposer?: boolean;
  alwaysShowSend?: boolean;
}

const Chat = ({ deal, disableComposer, style, alwaysShowSend }: ChatProps) => {
  const { data } = useCollectionSnapshot<Message>({
    collectionName: messagesApi.collectionName,
    query: (ref) => {
      return ref.where("dealId", "==", deal.id).orderBy("timestamp", "asc");
    },
  });
  const { profile, user } = useAuth();
  const {
    addMessage,
    toMessage,
    toChatMessage,
    updateMessagesRecieved,
    getNonRecievedMessages,
  } = useChat();
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const nonRecievedMessages = getNonRecievedMessages(data);
      if (nonRecievedMessages && nonRecievedMessages.length > 0) {
        updateMessagesRecieved(nonRecievedMessages);
      }

      if (deal.newMessages && deal.newMessages[profile.id]) {
        const dealNewMessages = deal.newMessages![profile.id];
        const unSynced = data.filter((i) => dealNewMessages.includes(i.id));
        if (unSynced && unSynced.length > 0) {
          const toRemove = data.map((d) => d.id);
          dealsApi.updateDealMessagesRecieved(deal.id, toRemove);
        }
      }

      const freshChatMessages = data
        ?.filter((m) => {
          const isFilteredSystemMessage =
            m.system &&
            m.messageType === "DEAL_CREATED_PROCEED_INSTRUCTIONS" &&
            user.id === m?.user?.id;
          return !isFilteredSystemMessage;
        })
        ?.map(toChatMessage);

      setChatMessages(freshChatMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const renderSend = useCallback(
    (props) => (
      <Send {...props} containerStyle={styles.sendContainer}>
        <Icon name="send-circle" color={theme.colors.salmon} size={35} />
      </Send>
    ),
    []
  );

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const lastMessage = newMessages[newMessages.length - 1];

      // Optimistically update the UI immediately
      setChatMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      // Then persist to database
      const message = toMessage(lastMessage, deal);
      await addMessage(message, deal);
    },
    [addMessage, deal, toMessage]
  );

  const renderBubble = useCallback(
    (props) => (
      <Bubble
        {...props}
        textStyle={{ right: styles.rightText, left: styles.leftText }}
        wrapperStyle={{ right: styles.rightBubble, left: styles.leftBubble }}
      />
    ),
    []
  );

  const renderSystemMessage = (props: any) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={styles.systemMessageContainer}
        textStyle={styles.systemMessageText}
      />
    );
  };

  const renderComposer = useCallback(
    (props) =>
      disableComposer ? (
        <></>
      ) : (
        <Composer
          {...props}
          textInputStyle={styles.textInput}
          multiline={true}
        />
      ),
    [disableComposer]
  );

  // const chatMessages: IMessage[] | undefined = useMemo(
  //   () => data?.map(toChatMessage),
  //   [data, toChatMessage],
  // );
  const renderMessage = (props: any) => {
    return (
      <CMessage
        {...props}
        linkStyle={{
          right: {
            color: theme.colors.pictonBlue,
          },
          left: {
            color: theme.colors.pictonBlue,
          },
        }}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {data && (
        <GiftedChat
          messagesContainerStyle={styles.messagesContainer}
          timeTextStyle={{ right: styles.rightText, left: styles.leftText }}
          renderBubble={renderBubble}
          renderSend={renderSend}
          renderMessage={renderMessage}
          messages={chatMessages}
          renderInputToolbar={(props) =>
            !disableComposer ? (
              <InputToolbar
                {...props}
                containerStyle={styles.toolbar}
                //@ts-ignore
                textInputProps={{
                  returnKeyType: "send",
                  // onSubmitEditing: (event: any) => {
                  //   // props.onSend({text: event.nativeEvent.text.trim()}, true);
                  // },
                }}
              />
            ) : (
              <></>
            )
          }
          renderSystemMessage={renderSystemMessage}
          onSend={onSend}
          user={{
            _id: profile.id,
          }}
          disableComposer={disableComposer}
          alwaysShowSend={alwaysShowSend}
          renderComposer={renderComposer}
        />
      )}
    </View>
  );
};

export default React.memo(Chat);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {},
  rightBubble: {
    backgroundColor: theme.colors.lightGrey,
  },
  leftBubble: {
    backgroundColor: theme.colors.rose,
  },
  rightText: {
    color: theme.colors.dark,
  },
  leftText: {
    color: theme.colors.dark,
  },
  day: {
    color: "red",
  },
  textInput: {
    color: theme.colors.dark,
  },
  toolbar: {
    borderWidth: 2,
    borderColor: theme.colors.lightGrey,
    borderRadius: 10,
  },
  chatFooter: {},
  systemMessageContainer: {
    // backgroundColor: 'grey',
  },
  systemMessageText: {
    backgroundColor: theme.colors.dark,
    color: theme.colors.white,
    padding: 10,
    borderRadius: 7,
    // borderWidth: 1,
    // bod
    overflow: "hidden",
    fontWeight: theme.fontWeight.bold,
  },
});
