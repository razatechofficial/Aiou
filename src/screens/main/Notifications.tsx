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
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useNavigationType from '../../hooks/useAndroidNavigationType';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

// Types
type NavigationType = NavigationProp<any>;

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'academic' | 'financial' | 'general' | 'emergency' | 'reminder';
  date: string;
  time: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
  icon: string;
  color: string;
}

// ===== Dummy Notifications Data =====
const notificationsData: NotificationItem[] = [
  {
    id: '1',
    title: 'Assignment Submission Deadline',
    message:
      'Your assignment for CS-101 is due tomorrow. Please submit it through the student portal.',
    type: 'academic',
    date: 'Mar 15, 2024',
    time: '10:30 AM',
    isRead: false,
    priority: 'high',
    category: 'Assignment',
    icon: 'file-text',
    color: '#E91E63',
  },
  {
    id: '2',
    title: 'Fee Payment Reminder',
    message:
      'Your semester fee payment is due on March 20, 2024. Please complete the payment to avoid late fees.',
    type: 'financial',
    date: 'Mar 14, 2024',
    time: '2:15 PM',
    isRead: false,
    priority: 'high',
    category: 'Payment',
    icon: 'credit-card',
    color: '#FF5722',
  },
  {
    id: '3',
    title: 'Exam Schedule Updated',
    message:
      'The mid-term examination schedule has been updated. Please check your student portal for the new dates.',
    type: 'academic',
    date: 'Mar 13, 2024',
    time: '9:45 AM',
    isRead: true,
    priority: 'medium',
    category: 'Examination',
    icon: 'calendar',
    color: '#2196F3',
  },
  {
    id: '4',
    title: 'Library Book Return',
    message:
      'The book "Advanced Mathematics" is due for return on March 18, 2024. Please return it to avoid fines.',
    type: 'reminder',
    date: 'Mar 12, 2024',
    time: '4:20 PM',
    isRead: true,
    priority: 'medium',
    category: 'Library',
    icon: 'book',
    color: '#4CAF50',
  },
  {
    id: '5',
    title: 'Campus Maintenance Notice',
    message:
      'The computer lab will be closed for maintenance on March 16, 2024. Alternative arrangements have been made.',
    type: 'general',
    date: 'Mar 11, 2024',
    time: '11:30 AM',
    isRead: true,
    priority: 'low',
    category: 'Maintenance',
    icon: 'tool',
    color: '#9C27B0',
  },
  {
    id: '6',
    title: 'Scholarship Application Open',
    message:
      'Applications for need-based scholarships are now open. Submit your application by March 25, 2024.',
    type: 'financial',
    date: 'Mar 10, 2024',
    time: '3:00 PM',
    isRead: true,
    priority: 'medium',
    category: 'Scholarship',
    icon: 'award',
    color: '#00BCD4',
  },
  {
    id: '7',
    title: 'Student Council Elections',
    message:
      'Student council elections will be held on March 22, 2024. All students are encouraged to participate.',
    type: 'general',
    date: 'Mar 9, 2024',
    time: '1:15 PM',
    isRead: true,
    priority: 'low',
    category: 'Elections',
    icon: 'users',
    color: '#FF9800',
  },
  {
    id: '8',
    title: 'Emergency: Campus Closure',
    message:
      'Due to inclement weather, the campus will be closed tomorrow. All classes are cancelled.',
    type: 'emergency',
    date: 'Mar 8, 2024',
    time: '8:00 PM',
    isRead: true,
    priority: 'high',
    category: 'Emergency',
    icon: 'alert-triangle',
    color: '#F44336',
  },
  {
    id: '9',
    title: 'Online Class Link',
    message:
      'Your online class for tomorrow will be conducted via Zoom. Check your email for the meeting link.',
    type: 'academic',
    date: 'Mar 7, 2024',
    time: '5:30 PM',
    isRead: true,
    priority: 'medium',
    category: 'Online Class',
    icon: 'video',
    color: '#673AB7',
  },
  {
    id: '10',
    title: 'Graduation Ceremony Details',
    message:
      'Graduation ceremony details have been finalized. Please check the student portal for your schedule.',
    type: 'academic',
    date: 'Mar 6, 2024',
    time: '2:45 PM',
    isRead: true,
    priority: 'medium',
    category: 'Graduation',
    icon: 'graduation-cap',
    color: '#795548',
  },
];

const Notifications: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigationType = useNavigationType();
  const navigation = useNavigation();
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(notificationsData);
  const [filter, setFilter] = useState<
    | 'all'
    | 'unread'
    | 'academic'
    | 'financial'
    | 'general'
    | 'emergency'
    | 'reminder'
  >('all');

  useEffect(() => {
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#01848F', false);
    }
  }, []);

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.type === filter);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true })),
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#F44336';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic':
        return '#2196F3';
      case 'financial':
        return '#FF5722';
      case 'general':
        return '#9C27B0';
      case 'emergency':
        return '#F44336';
      case 'reminder':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const filteredNotifications = getFilteredNotifications();

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
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {filteredNotifications.filter(n => !n.isRead).length} unread
          </Text>
        </View>
        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Mark all read</Text>
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
          { key: 'all', label: 'All', count: notifications.length },
          {
            key: 'unread',
            label: 'Unread',
            count: notifications.filter(n => !n.isRead).length,
          },
          {
            key: 'academic',
            label: 'Academic',
            count: notifications.filter(n => n.type === 'academic').length,
          },
          {
            key: 'financial',
            label: 'Financial',
            count: notifications.filter(n => n.type === 'financial').length,
          },
          {
            key: 'general',
            label: 'General',
            count: notifications.filter(n => n.type === 'general').length,
          },
          {
            key: 'emergency',
            label: 'Emergency',
            count: notifications.filter(n => n.type === 'emergency').length,
          },
          {
            key: 'reminder',
            label: 'Reminders',
            count: notifications.filter(n => n.type === 'reminder').length,
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

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="bell-off" size={64} color="#9E9E9E" />
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateSubtitle}>
              {filter === 'all'
                ? "You're all caught up!"
                : `No ${filter} notifications found`}
            </Text>
          </View>
        ) : (
          filteredNotifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.isRead && styles.notificationCardUnread,
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationIconContainer}>
                  <View
                    style={[
                      styles.notificationIcon,
                      { backgroundColor: notification.color },
                    ]}
                  >
                    <Feather
                      name={notification.icon as any}
                      size={20}
                      color="white"
                    />
                  </View>
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationTitleRow}>
                    <Text
                      style={[
                        styles.notificationTitle,
                        !notification.isRead && styles.notificationTitleUnread,
                      ]}
                    >
                      {notification.title}
                    </Text>
                    <View
                      style={[
                        styles.priorityIndicator,
                        {
                          backgroundColor: getPriorityColor(
                            notification.priority,
                          ),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.notificationMessage} numberOfLines={2}>
                    {notification.message}
                  </Text>
                  <View style={styles.notificationFooter}>
                    <View style={styles.notificationMeta}>
                      <Text style={styles.notificationDate}>
                        {notification.date}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {notification.time}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: getTypeColor(notification.type) },
                      ]}
                    >
                      <Text style={styles.categoryBadgeText}>
                        {notification.category}
                      </Text>
                    </View>
                  </View>
                </View>
                {!notification.isRead && (
                  <View style={styles.unreadIndicator} />
                )}
              </View>
            </TouchableOpacity>
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
  markAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  markAllText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
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
  notificationsList: {
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
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#E0E0E0',
  },
  notificationCardUnread: {
    borderLeftColor: '#01848F',
    backgroundColor: '#F8F9FF',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIconContainer: {
    marginRight: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  notificationTitleUnread: {
    fontWeight: '600',
    color: '#01848F',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#01848F',
    marginLeft: 8,
    marginTop: 4,
  },
});

export default Notifications;
