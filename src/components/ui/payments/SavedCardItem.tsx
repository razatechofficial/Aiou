// src/components/SavedCardItem.tsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {PaymentMethod} from '../types/PaymentTypes';

interface SavedCardItemProps {
  card: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
}

const SavedCardItem = ({card, selected, onSelect}: SavedCardItemProps) => {
  // Get card brand logo or use default text
  const getCardBrandLogo = (brand: string) => {
    // You could return an image component here based on the brand
    return brand.toUpperCase();
  };

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={onSelect}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardBrand}>
          {getCardBrandLogo(card.card.brand)}
        </Text>
        <Text style={styles.cardNumber}>•••• {card.card.last4}</Text>
        <Text style={styles.cardExpiry}>
          Exp: {card.card.exp_month}/{card.card.exp_year}
        </Text>
      </View>
      <View style={styles.radioContainer}>
        <View
          style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
  },
  selected: {
    borderColor: '#0070BA',
    backgroundColor: '#F0F8FF',
  },
  cardInfo: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 14,
    color: '#666',
  },
  radioContainer: {
    marginLeft: 12,
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#0070BA',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#0070BA',
  },
});

export default SavedCardItem;
