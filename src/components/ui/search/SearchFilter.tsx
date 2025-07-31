import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Slider} from 'react-native-awesome-slider';
import {useSharedValue} from 'react-native-reanimated';
import {ShadowView, LinearShadowView} from 'react-native-inner-shadow';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const PADDING = 20;
const CONTAINER_WIDTH = SCREEN_WIDTH - PADDING * 2;

interface FilterOption {
  id: string;
  label: string;
}

const sortOptions: FilterOption[] = [
  {id: 'popular', label: 'Popular'},
  {id: 'lowest', label: 'Lowest Price'},
  {id: 'highest', label: 'Highest Price'},
  {id: 'best', label: 'Best Match'},
  {id: 'nearby', label: 'Nearby'},
];

const deliveryOptions: FilterOption[] = [
  {id: 'regular', label: 'Regular Delivery'},
  {id: 'emergency', label: 'Emergency Delivery'},
];

const SearchFilter: React.FC = () => {
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedDelivery, setSelectedDelivery] = useState('regular');
  const progress = useSharedValue(50);
  const min = useSharedValue(5);
  const max = useSharedValue(250);

  const renderFilterPill = (
    option: FilterOption,
    isSelected: boolean,
    onSelect: (id: string) => void,
  ) => (
    <TouchableOpacity
      key={option.id}
      onPress={() => onSelect(option.id)}
      activeOpacity={0.7}>
      <ShadowView
        style={[
          styles.pillContainer,
          isSelected && styles.pillContainerSelected,
        ]}
        inset
        shadowColor={isSelected ? '#01848F66' : '#00000033'}
        shadowOffset={{width: 2, height: 2}}
        shadowBlur={3}
        isReflectedLightEnabled={false}>
        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
          {option.label}
        </Text>
      </ShadowView>
    </TouchableOpacity>
  );

  const renderFilterPills = useCallback(
    (
      options: FilterOption[],
      selectedValue: string,
      onSelect: (id: string) => void,
    ) => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsContainer}
        decelerationRate="fast"
        snapToInterval={CONTAINER_WIDTH / 3}
        snapToAlignment="start"
        overScrollMode="never"
        scrollEventThrottle={16}
        pagingEnabled={false}
        directionalLockEnabled={true}
        alwaysBounceHorizontal={false}
        keyboardShouldPersistTaps="handled">
        {options.map(option =>
          renderFilterPill(option, selectedValue === option.id, onSelect),
        )}
      </ScrollView>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          {renderFilterPills(sortOptions, selectedSort, setSelectedSort)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${min.value.toFixed(0)}</Text>
            <Text style={styles.priceText}>${max.value.toFixed(0)}</Text>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              progress={progress}
              minimumValue={min}
              maximumValue={max}
              step={1}
              theme={{
                disableMinTrackTintColor: '#e228f0',
                maximumTrackTintColor: '#e2e8f0',
                minimumTrackTintColor: '#01848F',
                cacheTrackTintColor: '#333',
                bubbleBackgroundColor: '#01848F',
                heartbeatColor: '#999',
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery</Text>
          {renderFilterPills(
            deliveryOptions,
            selectedDelivery,
            setSelectedDelivery,
          )}
        </View>

        <LinearShadowView
          style={styles.applyButton}
          from="top"
          to="bottom"
          colors={['#01848F', '#015F66']}
          shadowColor="#00000066"
          shadowOffset={{width: 0, height: 4}}
          shadowBlur={8}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </LinearShadowView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: PADDING,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  pillsContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingRight: PADDING,
    flexGrow: 1,
  },
  pillContainer: {
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
    flexShrink: 0,
  },
  pillContainerSelected: {
    backgroundColor: '#e6f7f8',
  },
  pillText: {
    fontSize: 14,
    color: '#4b5563',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  pillTextSelected: {
    color: '#01848F',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  priceText: {
    fontSize: 14,
    color: '#01848F',
    fontWeight: '500',
  },
  sliderContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  slider: {
    width: CONTAINER_WIDTH - 30,
    height: 40,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchFilter;



