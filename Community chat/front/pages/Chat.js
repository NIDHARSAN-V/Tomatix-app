import React from 'react';
import { View, StyleSheet } from 'react-native';
import MessageForm from '../comp/Messageform';
import PanelSide from '../comp/PanelSide';

function Chat() {
  return (
    <View style={styles.container}>
      <View style={styles.panelSide}>
        <PanelSide />
      </View>
      <View style={styles.messageForm}>
        <MessageForm />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  panelSide: {
    flex: 1,
  },
  messageForm: {
    flex: 2,
  },
});

export default Chat;
