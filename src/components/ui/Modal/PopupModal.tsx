import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importing Ionicons from React Native Vector Icons

interface PopupModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
}

const PopupModal: React.FC<PopupModalProps> = ({
  visible,
  onClose,
  title = 'Modal Title',
  children,
  titleStyle,
  contentStyle,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, contentStyle]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={30} color="gray" />
          </TouchableOpacity>
          {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          <View style={styles.body}>
            {children} {/* Dynamic content goes here */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '95%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative', // Important for positioning close button
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Make sure the close button stays on top of other content
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  body: {
    marginBottom: 10,
    width: '100%',
  },
});

export default PopupModal;
