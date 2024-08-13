import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';

function MessageForm() {
  const user = useSelector((state) => state.user);
  const scrollViewRef = useRef(null);
  const [message, setMessage] = useState("");
  const { socket, currentRoom, messages, setMessages, privateMemberMsg } = useContext(AppContext);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }

  function getFormattedDate() {
    const date = new Date();
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  }

  const todayDate = getFormattedDate();

  useEffect(() => {
    socket.off("room-messages").on("room-messages", (roomMessages) => {
      setMessages(roomMessages);
    });
  }, [socket, setMessages]);

  function handleSubmit() {
    if (!message) {
      return;
    }
    const today = new Date();
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const time = `${today.getHours()}:${minutes}`;
    const roomId = currentRoom;
    socket.emit('message-room', roomId, message, user, time, todayDate);
    setMessage("");
  }

  return (
    <>
      <ScrollView style={styles.messagesOutput} ref={scrollViewRef} onContentSizeChange={scrollToBottom}>
        {user && !privateMemberMsg?._id && (
          <View style={styles.alert}>
            <Text>You are in {currentRoom}</Text>
          </View>
        )}
        {user && privateMemberMsg?._id && (
          <View style={styles.conversationalInfo}>
            <Text>Your conversation with {privateMemberMsg.name}</Text>
            <Image source={{ uri: privateMemberMsg.picture }} style={styles.converPic} />
          </View>
        )}
        {!user && (
          <View style={styles.alertDanger}>
            <Text>Please login to your account</Text>
          </View>
        )}
        {user && messages.map(({ _id: date, messagesByDate }, idx) => (
          <View key={idx}>
            <Text style={styles.messageDateIndicator}>{date}</Text>
            {messagesByDate?.map(({ content, time, from: sender }, msgidx) => (
              <View style={sender?.email === user?.email ? styles.message : styles.incomingMessage} key={msgidx}>
                <View style={styles.messageInner}>
                  <View style={styles.messageHeader}>
                    <Image source={{ uri: sender.picture }} style={styles.senderPic} />
                    <Text style={styles.messageSender}>{sender._id === user?._id ? "You" : sender.name}</Text>
                  </View>
                  <Text style={styles.messageContent}>{content}</Text>
                  <Text style={styles.messageTimestamp}>{time}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Your Message"
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <Button title="Send" onPress={handleSubmit} color="orange" disabled={!user} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  messagesOutput: {
    flex: 1,
    padding: 10,
  },
  alert: {
    backgroundColor: '#d1ecf1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  conversationalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1ecf1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  converPic: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginLeft: 10,
  },
  alertDanger: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  messageDateIndicator: {
    textAlign: 'center',
    backgroundColor: '#d1ecf1',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  message: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    maxWidth: '80%',
  },
  incomingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    maxWidth: '80%',
  },
  messageInner: {
    flexDirection: 'column',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  senderPic: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
  messageSender: {
    fontWeight: 'bold',
  },
  messageContent: {
    marginBottom: 5,
  },
  messageTimestamp: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#999',
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default MessageForm;
