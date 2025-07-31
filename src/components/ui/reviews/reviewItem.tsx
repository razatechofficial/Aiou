import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {ShadowView} from 'react-native-inner-shadow';
import Icon from 'react-native-vector-icons/Feather';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isLargeDevice = SCREEN_WIDTH >= 768;

const CARD_WIDTH = isSmallDevice ? 250 : isLargeDevice ? 350 : 300;
const CARD_HEIGHT = isSmallDevice ? 180 : isLargeDevice ? 220 : 200;

interface ReviewItemProps {
  name: string;
  date: string;
  rating: number;
  comment: string;
  image?: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  name,
  date,
  rating,
  comment,
}) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name="star"
          size={isSmallDevice ? 16 : isLargeDevice ? 24 : 20}
          color={i <= rating ? '#FFD700' : '#E0E0E0'}
          style={styles.star}
        />,
      );
    }
    return stars;
  };

  return (
    <View
      style={[styles.cardContainer, {width: CARD_WIDTH, height: CARD_HEIGHT}]}>
      <ShadowView
        inset
        backgroundColor="#fff"
        shadowColor="#A4A1A066"
        shadowOffset={{width: 0, height: 0}}
        shadowBlur={4}
        style={styles.cardContent}>
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.starsContainer}>{renderStars()}</View>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.comment} numberOfLines={4}>
            {comment}
          </Text>
        </View>
      </ShadowView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 0.35,
  },
  cardContent: {
    flex: 1,
    padding: isSmallDevice ? 12 : 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: isSmallDevice ? 6 : 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  name: {
    fontSize: isSmallDevice ? 14 : isLargeDevice ? 18 : 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: isSmallDevice ? 12 : isLargeDevice ? 16 : 14,
    color: '#666',
    marginBottom: isSmallDevice ? 6 : 8,
  },
  comment: {
    fontSize: isSmallDevice ? 12 : isLargeDevice ? 16 : 14,
    color: '#555',
    lineHeight: isSmallDevice ? 18 : isLargeDevice ? 24 : 20,
  },
});

export default ReviewItem;
