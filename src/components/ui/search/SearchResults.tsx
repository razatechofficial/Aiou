import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
// import { Service } from '../types/service';

interface SearchResultsProps {
  results: Service[];
  onSelect: (service: Service) => void;
  visible: boolean;
}
export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: string;
  category: string;
}

export const SearchResults = ({
  results,
  onSelect,
  visible,
}: SearchResultsProps) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {results.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Icon name="search" size={48} color="#009688" />
            <Text style={styles.noResultsText}>No services found</Text>
            <Text style={styles.noResultsSubtext}>
              Try a different search term
            </Text>
          </View>
        ) : (
          results.map(service => (
            <TouchableOpacity
              key={service.id}
              style={styles.resultItem}
              onPress={() => onSelect(service)}>
              <View style={styles.iconContainer}>
                <Icon name={service.icon as any} size={24} color="#009688" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>
                  {service.description}
                </Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    maxHeight: 400,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollView: {
    maxHeight: 400,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 14,
    color: '#009688',
    fontWeight: '500',
    marginTop: 2,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
