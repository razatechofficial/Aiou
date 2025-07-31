// import React, {useRef, useCallback} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
// // import {useSafeAreaInsets} from 'react-native-safe-area-context';

// const SCREEN_HEIGHT = Dimensions.get('window').height;

// interface CustomBottomSheetModalProps {
//   title?: string;
//   subtitle?: string;
//   closeButton?: boolean;
//   modalBody: React.ReactNode;
//   snapPoints?: number[];
// }

// const CustomBottomSheetModal: React.FC<CustomBottomSheetModalProps> = ({
//   title,
//   subtitle,
//   closeButton = true,
//   modalBody,
//   snapPoints = [
//     SCREEN_HEIGHT * 0.25,
//     SCREEN_HEIGHT * 0.6,
//     SCREEN_HEIGHT * 0.85,
//   ], // Default snap points
// }) => {
//   const bottomSheetRef = useRef<BottomSheetModal>(null);
//   // const insets = useSafeAreaInsets();
//   // const availableHeight = SCREEN_HEIGHT - insets.bottom;

//   const handleSheetChanges = useCallback((index: number) => {
//     console.log('handleSheetChanges', index);
//   }, []);

//   const openBottomSheet = () => {
//     if (bottomSheetRef.current) {
//       bottomSheetRef.current.present(); // Correct way to call the present method
//     }
//   };

//   const closeBottomSheet = () => {
//     if (bottomSheetRef.current) {
//       bottomSheetRef.current.dismiss(); // Close the bottom sheet
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Trigger button to open Bottom Sheet */}
//       <TouchableOpacity onPress={openBottomSheet} style={styles.openButton}>
//         <Text style={styles.buttonText}>Open Bottom Sheet</Text>
//       </TouchableOpacity>

//       {/* Bottom Sheet Modal */}
//       <BottomSheetModal
//         ref={bottomSheetRef}
//         snapPoints={snapPoints}
//         index={0} // Default open state
//         onChange={handleSheetChanges}
//         enablePanDownToClose={true} // Allow closing by dragging down
//         enableOverDrag={false}
//         style={styles.bottomSheet}
//         handleStyle={styles.handleStyle}
//         handleIndicatorStyle={styles.handleIndicatorStyle}>
//         <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
//           {/* Header Section (Title, Subtitle, Close Button) */}
//           {title && (
//             <View style={styles.header}>
//               <Text style={styles.headerTitle}>{title}</Text>
//               {subtitle && (
//                 <Text style={styles.headerSubtitle}>{subtitle}</Text>
//               )}
//               {closeButton && (
//                 <TouchableOpacity
//                   onPress={closeBottomSheet}
//                   style={styles.closeButton}>
//                   <Text style={styles.closeButtonText}>Close</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}

//           {/* Modal Body */}
//           <View style={styles.body}>{modalBody}</View>
//         </BottomSheetScrollView>
//       </BottomSheetModal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'grey',
//   },
//   openButton: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   bottomSheet: {
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: -4},
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     zIndex: 10, // Ensure bottom sheet appears above the tab bar
//   },
//   handleStyle: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//     paddingTop: 12,
//   },
//   handleIndicatorStyle: {
//     backgroundColor: '#DDDDDD',
//     width: 50,
//   },
//   scrollContent: {
//     paddingBottom: 30,
//   },
//   header: {
//     padding: 20,
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEEEEE',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333333',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#666666',
//     marginTop: 5,
//   },
//   closeButton: {
//     backgroundColor: '#FF5C5C',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 15,
//   },
//   closeButtonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   body: {
//     padding: 20,
//   },
// });

// export default CustomBottomSheetModal;

// --------------------------------------------------------

// import type React from 'react';
// import {
//   useCallback,
//   useMemo,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
// } from 'react';
// import {StyleSheet, Dimensions, type ViewStyle} from 'react-native';
// import {
//   BottomSheetModal,
//   BottomSheetScrollView,
//   type BottomSheetModalProps,
// } from '@gorhom/bottom-sheet';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';

// const SCREEN_HEIGHT = Dimensions.get('window').height;

// interface BottomSheetModalComponentProps
//   extends Omit<BottomSheetModalProps, 'snapPoints'> {
//   children: React.ReactNode;
//   snapPointPercentages?: number[];
//   contentContainerStyle?: ViewStyle;
// }

// export interface BottomSheetModalComponentRef {
//   present: () => void;
//   dismiss: () => void;
// }

// const BottomSheetModalComponent = forwardRef<
//   BottomSheetModalComponentRef,
//   BottomSheetModalComponentProps
// >(
//   (
//     {
//       children,
//       snapPointPercentages = [0.25, 0.6, 0.85, 0.95],
//       contentContainerStyle,
//       ...props
//     },
//     ref,
//   ) => {
//     const bottomSheetRef = useRef<BottomSheetModal>(null);
//     const insets = useSafeAreaInsets();

//     const availableHeight = SCREEN_HEIGHT - insets.bottom;

//     const snapPoints = useMemo(
//       () =>
//         snapPointPercentages.map(percentage => availableHeight * percentage),
//       [availableHeight, snapPointPercentages],
//     );

//     const handleSheetChanges = useCallback((index: number) => {
//       console.log('handleSheetChanges', index);
//     }, []);

//     useImperativeHandle(ref, () => ({
//       present: () => bottomSheetRef.current?.present(),
//       dismiss: () => bottomSheetRef.current?.dismiss(),
//     }));

//     return (
//       <BottomSheetModal
//         ref={bottomSheetRef}
//         snapPoints={snapPoints}
//         index={0}
//         onChange={handleSheetChanges}
//         enablePanDownToClose={true}
//         enableOverDrag={false}
//         style={styles.bottomSheet}
//         handleStyle={styles.handleStyle}
//         handleIndicatorStyle={styles.handleIndicatorStyle}
//         {...props}>
//         <BottomSheetScrollView
//           contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>
//           {children}
//         </BottomSheetScrollView>
//       </BottomSheetModal>
//     );
//   },
// );

// const styles = StyleSheet.create({
//   bottomSheet: {
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: -4},
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     zIndex: 10,
//   },
//   handleStyle: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//     paddingTop: 12,
//   },
//   handleIndicatorStyle: {
//     backgroundColor: '#DDDDDD',
//     width: 50,
//   },
//   scrollContent: {
//     paddingBottom: 30,
//   },
// });

// export default BottomSheetModalComponent;

import type React from 'react';
import {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  type ViewStyle,
  type TextStyle,
  Platform,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface BottomSheetModalComponentProps
  extends Omit<BottomSheetModalProps, 'snapPoints'> {
  children: React.ReactNode;
  snapPointPercentages?: number[];
  contentContainerStyle?: ViewStyle;
  title?: string;
  subtitle?: string;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  defaultIndex?: number;
}

export interface BottomSheetModalComponentRef {
  present: () => void;
  dismiss: () => void;
}

const BottomSheetModalComponent = forwardRef<
  BottomSheetModalComponentRef,
  BottomSheetModalComponentProps
>(
  (
    {
      children,
      snapPointPercentages = [0.25, 0.6],
      contentContainerStyle,
      title,
      subtitle,
      headerStyle,
      titleStyle,
      subtitleStyle,
      defaultIndex = 0,
      ...props
    },
    ref,
  ) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();

    const availableHeight = SCREEN_HEIGHT - insets.top - insets.bottom;

    const snapPoints = useMemo(
      () =>
        snapPointPercentages.map(percentage => availableHeight * percentage),
      [availableHeight, snapPointPercentages],
    );

    const handleSheetChanges = useCallback((index: number) => {
      console.log('handleSheetChanges', index);
    }, []);

    useImperativeHandle(ref, () => ({
      present: () => bottomSheetRef.current?.present(),
      dismiss: () => bottomSheetRef.current?.dismiss(),
    }));

    const renderHeader = () => {
      if (!title && !subtitle) {
        return null;
      }
      return (
        <View style={[styles.header, headerStyle]}>
          {title && (
            <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
          )}
          {subtitle && (
            <Text style={[styles.headerSubtitle, subtitleStyle]}>
              {subtitle}
            </Text>
          )}
        </View>
      );
    };

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={defaultIndex}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        enableOverDrag={false}
        style={styles.bottomSheet}
        handleStyle={styles.handleStyle}
        handleIndicatorStyle={styles.handleIndicatorStyle}
        topInset={insets.top}
        {...props}>
        {renderHeader()}
        <BottomSheetScrollView
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  bottomSheet: {
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  handleStyle: {
    backgroundColor: '#FBFBFB',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 12,
  },
  handleIndicatorStyle: {
    backgroundColor: '#B4B4B8',
    width: 80,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
});

export default BottomSheetModalComponent;
