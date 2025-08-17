// src/screens/customer/Profile.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '../../store';
// import { logout } from '../../store/features/authSlice';
import { getInitialsFromName } from '../../utils/NameLetterSeperator';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { AppDispatch, RootState } from '../../redux/store';
import { logout } from '../../redux/features/authSlice';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

interface User {
  name: string;
  email: string;
  profile_image?: string;
}

const Profile: React.FC<Props> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );
  const navigation =
    useNavigation<NativeStackScreenProps<RootStackParamList>['navigation']>();
  const insets = useSafeAreaInsets();

  // Check authentication on screen focus
  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) {
        navigation.navigate('Auth', { screen: 'Login' });
      }
    }, [isAuthenticated, navigation]),
  );

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigation.navigate('Auth', { screen: 'Login' });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#01848F" />
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{error || 'Error: User not found'}</Text>
      </SafeAreaView>
    );
  }

  const typedUser = user as User;

  // Dummy academic data
  const academicData = {
    cgpa: '3.8',
    credits: '96',
    attendance: '95%',
    enrolledCourses: [
      {
        code: 'CS-101',
        name: 'Introduction to Programming',
        grade: 'A',
        credits: '3',
      },
      { code: 'CS-102', name: 'Data Structures', grade: 'A-', credits: '3' },
      { code: 'MATH-101', name: 'Calculus I', grade: 'B+', credits: '3' },
    ],
    upcomingExams: [
      {
        course: 'CS-101',
        date: 'Mar 25, 2024',
        time: '09:00 AM',
        venue: 'Room 101',
      },
      {
        course: 'CS-102',
        date: 'Mar 27, 2024',
        time: '02:00 PM',
        venue: 'Room 203',
      },
    ],
    academicHistory: [
      {
        semester: 'Fall 2023',
        cgpa: '3.7',
        status: 'Completed',
        credits: '18',
      },
      {
        semester: 'Spring 2023',
        cgpa: '3.6',
        status: 'Completed',
        credits: '18',
      },
    ],
    achievements: [
      {
        title: "Dean's List",
        date: 'Fall 2023',
        description: 'Top 5% of the class',
      },
      {
        title: 'Research Grant',
        date: 'Spring 2023',
        description: 'Awarded for AI research',
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#01848F"
        translucent
      />
      {/* Header Section */}
      <LinearGradient
        colors={['#01848F', '#016972']}
        style={[styles.headerWrapper, { paddingTop: insets.top + 2 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Profile</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')} // Ensure Settings screen exists
            style={styles.settingsButton}
          >
            <Feather name="settings" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Body Content */}
      <ScrollView style={styles.bodyContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {typedUser.profile_image ? (
              <Image
                source={{ uri: typedUser.profile_image }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initials}>
                  {getInitialsFromName(typedUser.name)}
                </Text>
              </View>
            )}
            <View style={styles.cgpaBadge}>
              <Text style={styles.cgpaText}>{academicData.cgpa}</Text>
              <Text style={styles.cgpaLabel}>CGPA</Text>
            </View>
          </View>
          <Text style={styles.userName}>{typedUser.name}</Text>
          <Text style={styles.studentId}>{typedUser.email}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Academic Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Feather name="book" size={24} color="#01848F" />
            <Text style={styles.statValue}>{academicData.credits}</Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="check-circle" size={24} color="#01848F" />
            <Text style={styles.statValue}>{academicData.attendance}</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="award" size={24} color="#01848F" />
            <Text style={styles.statValue}>{academicData.cgpa}</Text>
            <Text style={styles.statLabel}>CGPA</Text>
          </View>
        </View>

        {/* Current Courses */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Courses</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.coursesList}>
            {academicData.enrolledCourses.map((course, index) => (
              <View key={index} style={styles.courseCard}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseCode}>{course.code}</Text>
                  <Text style={styles.courseName}>{course.name}</Text>
                  <Text style={styles.courseCredits}>
                    {course.credits} Credits
                  </Text>
                </View>
                <View style={styles.gradeContainer}>
                  <Text style={styles.gradeText}>{course.grade}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Exams */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Exams</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.examsList}>
            {academicData.upcomingExams.map((exam, index) => (
              <View key={index} style={styles.examCard}>
                <View style={styles.examInfo}>
                  <Text style={styles.examCourse}>{exam.course}</Text>
                  <Text style={styles.examDateTime}>
                    {exam.date} at {exam.time}
                  </Text>
                  <Text style={styles.examVenue}>{exam.venue}</Text>
                </View>
                <Feather name="calendar" size={20} color="#01848F" />
              </View>
            ))}
          </View>
        </View>

        {/* Academic History */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Academic History</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.historyList}>
            {academicData.academicHistory.map((semester, index) => (
              <View key={index} style={styles.historyCard}>
                <View style={styles.historyInfo}>
                  <Text style={styles.semesterText}>{semester.semester}</Text>
                  <Text style={styles.statusText}>{semester.status}</Text>
                  <Text style={styles.creditsText}>
                    {semester.credits} Credits
                  </Text>
                </View>
                <View style={styles.cgpaContainer}>
                  <Text style={styles.cgpaValue}>{semester.cgpa}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.achievementsList}>
            {academicData.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <Feather name="award" size={24} color="#01848F" />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDate}>{achievement.date}</Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Feather name="book" size={24} color="#01848F" />
              </View>
              <Text style={styles.actionText}>Course Material</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Feather name="file-text" size={24} color="#01848F" />
              </View>
              <Text style={styles.actionText}>Results</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Feather name="calendar" size={24} color="#01848F" />
              </View>
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Feather name="credit-card" size={24} color="#01848F" />
              </View>
              <Text style={styles.actionText}>Fee Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  errorText: {
    color: '#EF4581',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerWrapper: {
    backgroundColor: '#01848F',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  settingsButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  bodyContainer: {
    flex: 1,
    paddingTop: 8,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#01848F',
  },
  initialsContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#01848F',
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#01848F',
  },
  cgpaBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#01848F',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cgpaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cgpaLabel: {
    fontSize: 10,
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 16,
    color: '#01848F',
    marginBottom: 10,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EF4581',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    color: '#01848F',
    fontSize: 14,
    fontWeight: '500',
  },
  coursesList: {
    gap: 12,
  },
  courseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  courseCredits: {
    fontSize: 12,
    color: '#01848F',
    fontWeight: '500',
  },
  gradeContainer: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#01848F',
  },
  examsList: {
    gap: 12,
  },
  examCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  examInfo: {
    flex: 1,
  },
  examCourse: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  examDateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  examVenue: {
    fontSize: 12,
    color: '#01848F',
    fontWeight: '500',
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyInfo: {
    flex: 1,
  },
  semesterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  creditsText: {
    fontSize: 12,
    color: '#01848F',
    fontWeight: '500',
  },
  cgpaContainer: {
    alignItems: 'center',
  },
  cgpaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#01848F',
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#01848F',
    marginBottom: 4,
    fontWeight: '500',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
