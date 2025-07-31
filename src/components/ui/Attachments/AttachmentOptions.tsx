import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CONTAINER_PADDING = 16;
const COLUMN_COUNT = 3;
const ITEM_SPACING = 8;

// Calculate item width based on screen width, padding, and desired spacing
const ITEM_WIDTH =
  (SCREEN_WIDTH - CONTAINER_PADDING * 2 - ITEM_SPACING * (COLUMN_COUNT - 1)) /
  COLUMN_COUNT;

interface AttachmentOption {
  id: string;
  icon: string;
  label: string;
  color: string;
}

interface AttachmentOptionsProps {
  onOptionSelect?: (optionId: string) => void;
}
const attachmentOptions: AttachmentOption[] = [
  {
    id: 'quote',
    icon: 'request-quote',
    label: 'Quote',
    color: '#2196F3',
  },
  {
    id: 'document',
    icon: 'insert-drive-file',
    label: 'Document',
    color: '#7F66FF',
  },
  {
    id: 'camera',
    icon: 'camera-alt',
    label: 'Camera',
    color: '#FF6B6B',
  },
  {
    id: 'gallery',
    icon: 'image',
    label: 'Gallery',
    color: '#4ECDC4',
  },
  {
    id: 'audio',
    icon: 'headset',
    label: 'Audio',
    color: '#FFB84D',
  },
  {
    id: 'location',
    icon: 'place',
    label: 'Location',
    color: '#45B649',
  },
];

// const AttachmentOptions: React.FC<AttachmentOptionsProps> = ({
//   onOptionSelect,
// }) => {
//   const renderAttachmentOption = (option: AttachmentOption) => (
//     <TouchableOpacity
//       key={option.id}
//       style={styles.optionButton}
//       onPress={() => onOptionSelect?.(option.id)}
//       activeOpacity={0.9}>
//       <View style={[styles.iconContainer, {backgroundColor: option.color}]}>
//         <MaterialIcons name={option.icon} size={28} color="#FFFFFF" />
//       </View>
//       <Text style={styles.optionLabel}>{option.label}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.optionsGrid}>
//         {attachmentOptions.map((option, index) => (
//           <View
//             key={option.id}
//             style={[
//               styles.optionWrapper,
//               (index + 1) % COLUMN_COUNT !== 0 &&
//                 styles.optionWrapperWithMargin,
//             ]}>
//             {renderAttachmentOption(option)}
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };
const AttachmentOptions: React.FC<AttachmentOptionsProps> = ({
  onOptionSelect,
}) => {
  const renderAttachmentOption = (option: AttachmentOption) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionButton}
      onPress={() => onOptionSelect?.(option.id)}
      activeOpacity={0.9}>
      <View style={[styles.iconContainer, {backgroundColor: option.color}]}>
        <MaterialIcons name={option.icon} size={28} color="#FFFFFF" />
      </View>
      <Text style={styles.optionLabel}>{option.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.optionsGrid}>
        {attachmentOptions.map((option, index) => (
          <View
            key={option.id}
            style={[
              styles.optionWrapper,
              // Add right margin to all items except the last in each row
              (index + 1) % COLUMN_COUNT !== 0 &&
                styles.optionWrapperWithMargin,
            ]}>
            {renderAttachmentOption(option)}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: CONTAINER_PADDING,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  optionWrapper: {
    width: ITEM_WIDTH,
  },
  optionWrapperWithMargin: {
    marginRight: ITEM_SPACING,
  },
  optionButton: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 17,
      },
    }),
  },
  optionLabel: {
    fontSize: 13,
    color: '#3C4043',
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default AttachmentOptions;
