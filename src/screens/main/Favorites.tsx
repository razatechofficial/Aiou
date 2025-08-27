import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useNavigationType from '../../hooks/useAndroidNavigationType';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

interface FavoriteItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'program' | 'course' | 'announcement' | 'event' | 'resource';
  image?: string;
  icon: string;
  color: string;
  date?: string;
  category: string;
}

const favoritesData: FavoriteItem[] = [
  {
    id: '1',
    title: 'Bachelor of Science in Computer Science',
    subtitle: 'BS Computer Science',
    description:
      '4-year program focusing on software development, algorithms, and computer systems',
    type: 'program',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
    icon: 'code',
    color: '#4CAF50',
    category: 'Computer Science',
  },
  {
    id: '2',
    title: 'Advanced Mathematics',
    subtitle: 'MATH-301',
    description: 'Advanced calculus, linear algebra, and mathematical analysis',
    type: 'course',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
    icon: 'book',
    color: '#2196F3',
    category: 'Mathematics',
  },
  {
    id: '3',
    title: 'Scholarship Applications Open',
    subtitle: 'Financial Aid',
    description: 'Applications for need-based scholarships are now open.',
    type: 'announcement',
    icon: 'award',
    color: '#00BCD4',
    date: 'Mar 10, 2024',
    category: 'Scholarship',
  },
  {
    id: '4',
    title: 'Student Council Elections',
    subtitle: 'Campus Event',
    description: 'Student council elections will be held on March 22, 2024.',
    type: 'event',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
    icon: 'users',
    color: '#FF9800',
    date: 'Mar 22, 2024',
    category: 'Elections',
  },
];

const Favorites: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState<FavoriteItem[]>(favoritesData);
  const [filter, setFilter] = useState<
    'all' | 'program' | 'course' | 'announcement' | 'event' | 'resource'
  >('all');

  useEffect(() => {
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#01848F', false);
    }
  }, []);

  const getFilteredFavorites = () => {
    if (filter === 'all') return favorites;
    return favorites.filter(item => item.type === filter);
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const filteredFavorites = getFilteredFavorites();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#01848F" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Favorites</Text>
          <Text style={styles.headerSubtitle}>
            {filteredFavorites.length} saved items
          </Text>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Feather name="share-2" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {[
          { key: 'all', label: 'All', count: favorites.length },
          {
            key: 'program',
            label: 'Programs',
            count: favorites.filter(f => f.type === 'program').length,
          },
          {
            key: 'course',
            label: 'Courses',
            count: favorites.filter(f => f.type === 'course').length,
          },
          {
            key: 'announcement',
            label: 'Announcements',
            count: favorites.filter(f => f.type === 'announcement').length,
          },
          {
            key: 'event',
            label: 'Events',
            count: favorites.filter(f => f.type === 'event').length,
          },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterTab,
              filter === tab.key && styles.filterTabActive,
            ]}
            onPress={() => setFilter(tab.key as any)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === tab.key && styles.filterTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            <View
              style={[
                styles.filterBadge,
                filter === tab.key && styles.filterBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.filterBadgeText,
                  filter === tab.key && styles.filterBadgeTextActive,
                ]}
              >
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Favorites List */}
      <ScrollView
        style={styles.favoritesList}
        showsVerticalScrollIndicator={false}
      >
        {filteredFavorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="star" size={64} color="#9E9E9E" />
            <Text style={styles.emptyStateTitle}>No favorites yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Start saving your favorite programs, courses, and announcements!
            </Text>
            <TouchableOpacity style={styles.browseButton}>
              <Text style={styles.browseButtonText}>Browse Programs</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredFavorites.map(favorite => (
            <View key={favorite.id} style={styles.favoriteCard}>
              <View style={styles.favoriteHeader}>
                <View style={styles.favoriteIconContainer}>
                  <View
                    style={[
                      styles.favoriteIcon,
                      { backgroundColor: favorite.color },
                    ]}
                  >
                    <Feather
                      name={favorite.icon as any}
                      size={20}
                      color="white"
                    />
                  </View>
                </View>
                <View style={styles.favoriteContent}>
                  <View style={styles.favoriteTitleRow}>
                    <Text style={styles.favoriteTitle} numberOfLines={1}>
                      {favorite.title}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFromFavorites(favorite.id)}
                    >
                      <Feather name="x" size={16} color="#999" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.favoriteSubtitle} numberOfLines={1}>
                    {favorite.subtitle}
                  </Text>
                  <View style={styles.favoriteMeta}>
                    <View
                      style={[
                        styles.typeBadge,
                        { backgroundColor: favorite.color },
                      ]}
                    >
                      <Text style={styles.typeBadgeText}>
                        {favorite.type.charAt(0).toUpperCase() +
                          favorite.type.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.favoriteCategory}>
                      {favorite.category}
                    </Text>
                    {favorite.date && (
                      <Text style={styles.favoriteDate}>{favorite.date}</Text>
                    )}
                  </View>
                </View>
              </View>

              {favorite.image && (
                <Image
                  source={{ uri: favorite.image }}
                  style={styles.favoriteImage}
                  resizeMode="cover"
                />
              )}

              <Text style={styles.favoriteDescription} numberOfLines={3}>
                {favorite.description}
              </Text>

              <View style={styles.favoriteActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Feather name="eye" size={16} color="#01848F" />
                  <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Feather name="share-2" size={16} color="#666" />
                  <Text style={[styles.actionButtonText, { color: '#666' }]}>
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#01848F',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  shareButton: {
    padding: 8,
  },
  filterContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    height: 36,
  },
  filterTabActive: {
    backgroundColor: '#01848F',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginRight: 8,
  },
  filterTabTextActive: {
    color: 'white',
  },
  filterBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterBadgeTextActive: {
    color: 'white',
  },
  favoritesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#01848F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  favoriteIconContainer: {
    marginRight: 12,
  },
  favoriteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  favoriteSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  favoriteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  favoriteCategory: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  favoriteDate: {
    fontSize: 12,
    color: '#999',
  },
  favoriteImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  favoriteDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  favoriteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F8F9FF',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#01848F',
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default Favorites;
