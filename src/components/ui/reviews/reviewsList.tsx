// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Platform,
// } from 'react-native';
// import ReviewItem from './reviewItem';
// // import ReviewItem from './ReviewItem';

// interface Review {
//   id: string;
//   name: string;
//   date: string;
//   rating: number;
//   comment: string;
//   image?: string;
// }

// interface ReviewsListProps {
//   reviews: Review[];
//   onViewMore: () => void;
// }

// const ReviewsList = ({reviews, onViewMore}: ReviewsListProps) => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Reviews</Text>
//         <TouchableOpacity onPress={onViewMore}>
//           <Text style={styles.viewMore}>View more</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={reviews}
//         renderItem={({item}) => (
//           <ReviewItem
//             name={item.name}
//             date={item.date}
//             rating={item.rating}
//             comment={item.comment}
//             image={item.image}
//           />
//         )}
//         keyExtractor={item => item.id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//         snapToAlignment="start"
//         decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.9}
//         snapToInterval={316} // item width + margin
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingHorizontal: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   viewMore: {
//     color: '#009688',
//     fontSize: 14,
//   },
//   listContent: {
//     paddingLeft: 16,
//     paddingRight: 8,
//     paddingVertical: 8,
//   },
// });

// export default ReviewsList;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import ReviewItem from './reviewItem';
// import ReviewItem from './ReviewItem';

interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  image?: string;
}

interface ReviewsListProps {
  reviews: Review[];
  onViewMore: () => void;
}

// Get device screen width to make component responsive
const {width: SCREEN_WIDTH} = Dimensions.get('window');

// Determine size category based on screen width
const isSmallDevice = SCREEN_WIDTH < 375;
const isLargeDevice = SCREEN_WIDTH >= 768;

// Calculate item width based on device size
const getItemWidth = () => {
  if (isSmallDevice) return 250;
  if (isLargeDevice) return 350;
  return 300;
};

const ReviewsList = ({reviews, onViewMore}: ReviewsListProps) => {
  // Calculate the snap interval (item width + margin)
  const snapInterval = getItemWidth() + 16;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reviews</Text>
        <TouchableOpacity onPress={onViewMore}>
          <Text style={styles.viewMore}>View more</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviews}
        renderItem={({item}) => (
          <ReviewItem
            name={item.name}
            date={item.date}
            rating={item.rating}
            comment={item.comment}
            image={item.image}
          />
        )}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToAlignment="start"
        decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.9}
        snapToInterval={snapInterval}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    // paddingHorizontal: 16,
  },
  title: {
    fontSize: isSmallDevice ? 16 : isLargeDevice ? 22 : 18,
    fontWeight: 'bold',
  },
  viewMore: {
    color: '#009688',
    fontSize: isSmallDevice ? 12 : isLargeDevice ? 16 : 14,
  },
  listContent: {
    // paddingLeft: 16,
    // paddingRight: 8,
    paddingVertical: 8,
  },
});

export default ReviewsList;
