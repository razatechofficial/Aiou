import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

export default function SlideUpModal() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Modal" onPress={() => setIsVisible(true)} />

      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}>
        <View style={styles.modalContent}>
          <Text>This is a Slide-Up Modal</Text>
          <Button title="Close" onPress={() => setIsVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});
