import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import Carousel from 'react-native-snap-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import useNavigationType from '../../hooks/useAndroidNavigationType';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { NavigationProp } from '@react-navigation/native';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const { width: screenWidth } = Dimensions.get('window');

// Types
type NavigationType = NavigationProp<any>;

interface AdItem {
  id: string;
  image: string;
  title: string;
}

// Add type definitions
interface ResearchAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface InternationalCollaboration {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface CommunityProgram {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// ===== Dummy sponsor ad images =====
const sponsorAds: AdItem[] = [
  {
    id: '1',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
    title: 'AIOU Main Campus',
  },
  {
    id: '2',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
    title: 'Gallery 19',
  },
  {
    id: '3',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
    title: 'Gallery 18',
  },
  {
    id: '4',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/05_0.JPG',
    title: 'Gallery 17',
  },
  {
    id: '5',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/06.JPG',
    title: 'Gallery 16',
  },
];

// ===== Quick Links =====
const quickLinks = [
  {
    id: '1',
    title: 'Student Portal',
    icon: 'user',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Library',
    icon: 'book',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Calendar',
    icon: 'calendar',
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Campus Map',
    icon: 'map',
    color: '#9C27B0',
  },
];

// ===== Important Announcements =====
const importantAnnouncements = [
  {
    id: '1',
    title: 'Admission Deadline Extended',
    description: 'Last date for Spring 2024 admissions extended to March 15',
    date: 'Feb 28, 2024',
    category: 'Admission',
    icon: 'bell',
    color: '#E91E63',
  },
  {
    id: '2',
    title: 'Scholarship Applications Open',
    description: 'Need-based scholarships available for Spring 2024',
    date: 'Feb 25, 2024',
    category: 'Scholarship',
    icon: 'award',
    color: '#00BCD4',
  },
  {
    id: '3',
    title: 'Campus Maintenance',
    description: 'Library will remain closed on March 5 for maintenance',
    date: 'Feb 20, 2024',
    category: 'Notice',
    icon: 'alert-triangle',
    color: '#FF5722',
  },
];

// ===== Academic Calendar =====
const academicCalendar = [
  {
    id: '1',
    title: 'Spring Semester 2024',
    startDate: 'Feb 01, 2024',
    endDate: 'Jun 30, 2024',
    status: 'Ongoing',
    icon: 'calendar',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Mid Term Examinations',
    startDate: 'Apr 15, 2024',
    endDate: 'Apr 30, 2024',
    status: 'Upcoming',
    icon: 'file-text',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Final Examinations',
    startDate: 'Jun 15, 2024',
    endDate: 'Jun 30, 2024',
    status: 'Upcoming',
    icon: 'edit',
    color: '#FF9800',
  },
];

// ===== Popular Programs =====
const popularPrograms = [
  {
    id: '1',
    title: 'Bachelor of Science',
    department: 'Computer Science',
    duration: '4 Years',
    icon: 'code',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Master of Business',
    department: 'Business Administration',
    duration: '2 Years',
    icon: 'briefcase',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Bachelor of Arts',
    department: 'Social Sciences',
    duration: '4 Years',
    icon: 'book-open',
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Master of Science',
    department: 'Engineering',
    duration: '2 Years',
    icon: 'flask',
    color: '#9C27B0',
  },
  {
    id: '5',
    title: 'Bachelor of Education',
    department: 'Education',
    duration: '4 Years',
    icon: 'graduation-cap',
    color: '#E91E63',
  },
  {
    id: '6',
    title: 'Master of Arts',
    department: 'Humanities',
    duration: '2 Years',
    icon: 'pen-tool',
    color: '#00BCD4',
  },
];

// ===== Research Centers =====
const researchCenters = [
  {
    id: '1',
    title: 'Center for Educational Technology',
    director: 'Prof. Dr. Nasir Mahmood',
    focus: 'Digital Learning',
    icon: 'monitor',
    color: '#E91E63',
  },
  {
    id: '2',
    title: 'Center for Distance Education',
    director: 'Prof. Dr. Zahid Majeed',
    focus: 'Open Learning',
    icon: 'globe',
    color: '#00BCD4',
  },
  {
    id: '3',
    title: 'Center for Research in Education',
    director: 'Prof. Dr. Rukhsana Durrani',
    focus: 'Educational Research',
    icon: 'bar-chart-2',
    color: '#FF5722',
  },
];

// ===== Research Achievements =====
const researchAchievements: ResearchAchievement[] = [
  {
    id: '1',
    title: 'AI in Education',
    description: 'Pioneering research in AI applications for distance learning',
    icon: 'cpu',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Sustainable Development',
    description: 'Research on sustainable education models',
    icon: 'leaf',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Digital Literacy',
    description: 'Advancing digital education in rural areas',
    icon: 'monitor',
    color: '#FF9800',
  },
];

// ===== International Collaborations =====
const internationalCollaborations = [
  {
    id: '1',
    title: 'Harvard University',
    description: 'Joint research programs and faculty exchange',
    icon: 'globe',
    color: '#E91E63',
    details: 'Research collaboration in education technology',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
  },
  {
    id: '2',
    title: 'University of Oxford',
    description: 'Collaborative research in education technology',
    icon: 'book',
    color: '#00BCD4',
    details: 'Student exchange program and joint degrees',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
  },
  {
    id: '3',
    title: 'UNESCO',
    description: 'Global education initiatives',
    icon: 'award',
    color: '#FF5722',
    details: 'Teacher training and curriculum development',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
  },
];

// ===== Research Publications =====
const researchPublications = [
  {
    id: '1',
    title: 'AI in Education',
    authors: 'Dr. Sarah Khan, Dr. Ali Ahmed',
    journal: 'Journal of Educational Technology',
    date: 'Jan 2024',
    category: 'Technology',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
  },
  {
    id: '2',
    title: 'Sustainable Development',
    authors: 'Dr. Fatima Malik, Dr. Hassan Raza',
    journal: 'Environmental Studies Review',
    date: 'Dec 2023',
    category: 'Environment',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
  },
  {
    id: '3',
    title: 'Digital Literacy',
    authors: 'Dr. Usman Khan, Dr. Ayesha Siddiqui',
    journal: 'Education Research Journal',
    date: 'Nov 2023',
    category: 'Education',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
  },
];

// ===== Student Testimonials =====
const studentTestimonials = [
  {
    id: '1',
    name: 'Sara Ahmed',
    program: 'MS Computer Science',
    testimonial:
      'AIOU provided me with excellent research opportunities and supportive faculty',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
    rating: 5,
  },
  {
    id: '2',
    name: 'Ali Hassan',
    program: 'M.Ed',
    testimonial:
      'The flexible learning system helped me balance work and studies effectively',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
    rating: 4,
  },
  {
    id: '3',
    name: 'Fatima Khan',
    program: 'BS Mathematics',
    testimonial:
      'The online resources and support system made distance learning smooth',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
    rating: 5,
  },
];

// ===== Campus Life =====
const campusLife = [
  {
    id: '1',
    title: 'Sports Complex',
    description:
      'State-of-the-art facilities for cricket, football, and indoor games',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
    activities: ['Cricket', 'Football', 'Table Tennis', 'Gym'],
    icon: 'activity',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Student Clubs',
    description: 'Join various student societies and clubs',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
    activities: [
      'Debate Club',
      'Science Society',
      'Literary Society',
      'Art Club',
    ],
    icon: 'users',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Cultural Events',
    description: 'Annual cultural festival and regular events',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
    activities: [
      'Cultural Festival',
      'Music Night',
      'Drama Society',
      'Art Exhibition',
    ],
    icon: 'music',
    color: '#FF9800',
  },
];

// ===== Virtual Tour =====
const virtualTour = [
  {
    id: '1',
    title: 'Main Campus Tour',
    description: 'Explore our beautiful main campus in Islamabad',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
    duration: '30 min',
    points: ['Main Building', 'Library', 'Auditorium', 'Sports Complex'],
    icon: 'map',
    color: '#FF5722',
  },
  {
    id: '2',
    title: 'Academic Blocks',
    description: 'Tour our state-of-the-art academic facilities',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
    duration: '20 min',
    points: [
      'Science Block',
      'Computer Labs',
      'Research Centers',
      'Classrooms',
    ],
    icon: 'book-open',
    color: '#673AB7',
  },
  {
    id: '3',
    title: 'Student Facilities',
    description: 'Discover student support services and amenities',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
    duration: '25 min',
    points: ['Cafeteria', 'Medical Center', 'Student Center', 'Hostels'],
    icon: 'home',
    color: '#009688',
  },
];

// ===== Alumni Success Stories =====
const alumniStories = [
  {
    id: '1',
    name: 'Dr. Sarah Ahmed',
    graduation: 'PhD Education, 2015',
    current: 'Professor at Harvard University',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
    quote: 'AIOU provided me with the foundation for my academic journey',
    icon: 'award',
    color: '#E91E63',
  },
  {
    id: '2',
    name: 'Mr. Ali Hassan',
    graduation: 'MS Computer Science, 2018',
    current: 'Senior Software Engineer at Google',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
    quote: 'The skills I learned at AIOU helped me excel in my career',
    icon: 'code',
    color: '#00BCD4',
  },
  {
    id: '3',
    name: 'Ms. Fatima Khan',
    graduation: 'M.Ed, 2016',
    current: 'Education Minister, Punjab',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
    quote: 'AIOU shaped my vision for education reform',
    icon: 'book',
    color: '#9C27B0',
  },
];

// ===== Community Engagement =====
const communityEngagement: CommunityProgram[] = [
  {
    id: '1',
    title: 'Literacy Programs',
    description: 'Community literacy initiatives across Pakistan',
    icon: 'book-open',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Rural Education',
    description: 'Education outreach in rural communities',
    icon: 'map',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Teacher Training',
    description: 'Professional development for educators',
    icon: 'users',
    color: '#FF9800',
  },
];

// ===== Academic Departments =====
const academicDepartments = [
  {
    id: '1',
    title: 'Faculty of Sciences',
    programs: 'BS, MS, PhD',
    icon: 'flask',
    color: '#4CAF50',
    description: 'Leading research in natural sciences and technology',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
    stats: {
      students: '5000+',
      faculty: '150+',
      research: '100+',
    },
    featuredPrograms: [
      'Computer Science',
      'Mathematics',
      'Physics',
      'Chemistry',
    ],
  },
  {
    id: '2',
    title: 'Faculty of Education',
    programs: 'B.Ed, M.Ed, PhD',
    icon: 'book-open',
    color: '#2196F3',
    description: 'Pioneering distance education and teacher training',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
    stats: {
      students: '10000+',
      faculty: '200+',
      research: '150+',
    },
    featuredPrograms: [
      'Early Childhood',
      'Special Education',
      'Educational Leadership',
      'Curriculum Studies',
    ],
  },
  {
    id: '3',
    title: 'Faculty of Social Sciences',
    programs: 'BA, MA, PhD',
    icon: 'users',
    color: '#FF9800',
    description: 'Exploring human society and social relationships',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
    stats: {
      students: '8000+',
      faculty: '120+',
      research: '80+',
    },
    featuredPrograms: [
      'Psychology',
      'Sociology',
      'Political Science',
      'Economics',
    ],
  },
  {
    id: '4',
    title: 'Faculty of Arabic & Islamic Studies',
    programs: 'BA, MA, PhD',
    icon: 'book',
    color: '#9C27B0',
    description: 'Preserving and promoting Islamic knowledge',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/05_0.JPG',
    stats: {
      students: '6000+',
      faculty: '100+',
      research: '60+',
    },
    featuredPrograms: [
      'Quranic Studies',
      'Hadith',
      'Islamic History',
      'Arabic Literature',
    ],
  },
];

// ===== Student Services =====
const studentServices = [
  {
    id: '1',
    title: 'Admission Office',
    contact: '051-111-112-468',
    hours: '9:00 AM - 5:00 PM',
    icon: 'user-plus',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Examination Department',
    contact: '051-9057611',
    hours: '9:00 AM - 5:00 PM',
    icon: 'file-text',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Student Support Center',
    contact: '051-111-112-468',
    hours: '24/7 Online Support',
    icon: 'help-circle',
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Regional Campuses',
    contact: 'Visit Website',
    hours: 'Check Timings',
    icon: 'map-pin',
    color: '#9C27B0',
  },
];

// ===== Faculty Highlights =====
const facultyHighlights = [
  {
    id: '1',
    name: 'Prof. Dr. Muhammad Naeem',
    designation: 'Dean Faculty of Sciences',
    achievement: 'Published in Nature Journal',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
  },
  {
    id: '2',
    name: 'Prof. Dr. Samina Malik',
    designation: 'Vice Chancellor',
    achievement: 'Awarded Best Teacher 2023',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
  },
  {
    id: '3',
    name: 'Prof. Dr. Abdul Raheem',
    designation: 'Dean Faculty of Education',
    achievement: 'Research Grant Awarded',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
  },
];

// ===== Student Clubs =====
const studentClubs = [
  {
    id: '1',
    name: 'Tech Innovators Club',
    description: 'Exploring cutting-edge technology and innovation',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
    icon: 'cpu',
    color: '#4CAF50',
    activities: ['Hackathons', 'Tech Talks', 'Workshops'],
    members: '150+',
    upcomingEvent: 'AI Workshop - Mar 20',
  },
  {
    id: '2',
    name: 'Literary Society',
    description: 'Promoting literature and creative writing',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
    icon: 'book',
    color: '#2196F3',
    activities: ['Poetry Recitals', 'Book Clubs', 'Writing Competitions'],
    members: '200+',
    upcomingEvent: 'Poetry Night - Mar 25',
  },
  {
    id: '3',
    name: 'Debate Society',
    description: 'Fostering critical thinking and public speaking',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
    icon: 'message-square',
    color: '#FF9800',
    activities: ['Debate Competitions', 'Public Speaking', 'Model UN'],
    members: '180+',
    upcomingEvent: 'Inter-University Debate - Apr 5',
  },
];

// ===== Faculty Achievements =====
const facultyAchievements = [
  {
    id: '1',
    name: 'Dr. Sarah Khan',
    designation: 'Professor of Computer Science',
    achievement: 'Awarded Best Researcher 2024',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
    details: 'Published 5 research papers in top-tier journals',
    date: 'Feb 2024',
  },
  {
    id: '2',
    name: 'Dr. Ali Hassan',
    designation: 'Dean of Education',
    achievement: 'International Education Award',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
    details: 'Recognized for innovative teaching methods',
    date: 'Jan 2024',
  },
  {
    id: '3',
    name: 'Dr. Fatima Malik',
    designation: 'Head of Research',
    achievement: 'Research Grant Awarded',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
    details: 'Received $500,000 for AI in Education project',
    date: 'Dec 2023',
  },
];

// ===== Campus News =====
const campusNews = [
  {
    id: '1',
    title: 'AIOU Launches New AI Lab',
    description: 'State-of-the-art facility for AI research and development',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/13.JPG',
    date: 'Mar 15, 2024',
    category: 'Facilities',
    readTime: '2 min read',
  },
  {
    id: '2',
    title: 'Record Enrollment for Spring 2024',
    description: 'Over 50,000 students enrolled in various programs',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/02_1.JPG',
    date: 'Mar 10, 2024',
    category: 'Admissions',
    readTime: '1 min read',
  },
  {
    id: '3',
    title: 'AIOU Ranked Top in Distance Education',
    description: 'Recognized for excellence in online learning',
    image: 'https://aiou.edu.pk/sites/default/files/gallery/03_0.JPG',
    date: 'Mar 5, 2024',
    category: 'Achievements',
    readTime: '3 min read',
  },
];

const Home = ({ navigation }: { navigation: NavigationType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const sponsorCarouselRef = useRef(null);

  //! Naviagtion Bar color for ANDROID
  const navigationType = useNavigationType();
  useEffect(() => {
    if (Platform.OS !== 'android') {
      console.log('Skipping navigation bar color change: Not Android');
      return;
    }

    console.log('useEffect running with navigationType:', navigationType);

    const applyNavigationBarColor = () => {
      try {
        if (navigationType === 'gestures') {
          changeNavigationBarColor('#ffffff', true);
        } else if (navigationType === 'buttons') {
          console.log(
            'Button navigation detected, leaving default (no change)',
          );
          // Do nothing to keep the default system color
        } else {
          console.log('Navigation type is unknown, skipping');
        }
      } catch (error) {
        console.error('Error applying navigation bar color:', error);
      }
    };

    applyNavigationBarColor();
  }, [navigationType]);

  useEffect(() => {
    // Simulate a network delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Render sponsor ad card (or its placeholder)
  const renderAdItem = ({ item }: { item: AdItem }) => {
    if (loading) {
      return (
        <View style={styles.adCard}>
          <ShimmerPlaceholder style={styles.adImage} />
        </View>
      );
    }
    return (
      <View style={styles.adCard}>
        <Image source={{ uri: item.image }} style={styles.adImage} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#01848F"
        translucent
      />
      {/* Header Section */}
      <SafeAreaView
        style={[styles.headerWrapper, { paddingTop: insets.top + 2 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.topRow}>
            <View style={styles.locationInfo}>
              <View style={styles.locationTitleRow}>
                <Feather
                  name="map-pin"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.locationTitle}>AIOU Campus</Text>
              </View>
              <Text style={styles.locationSubtitle} numberOfLines={1}>
                Sector H-8, Islamabad
              </Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
                style={{ marginRight: 16 }}
              >
                <Feather name="bell" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Favorites')}
              >
                <Feather name="star" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Feather name="search" size={18} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search programs, courses..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={text => {
                  setSearchQuery(text);
                  setIsSearching(text.length > 0);
                }}
              />
              {isSearching && (
                <ActivityIndicator
                  style={styles.searchLoader}
                  color="#EF4581"
                />
              )}
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setIsSearching(false);
                  }}
                  style={styles.clearButton}
                >
                  <Feather name="x" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Body Content */}
      <ScrollView
        style={styles.bodyContainer}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* 1. Admission Ads Section */}
        <View style={styles.sponsoredContainer}>
          <View style={styles.sponsorHeadingLabel}>
            <Text style={styles.sponsorHeading}>AIOU Admission Open</Text>
          </View>
          <Carousel
            ref={sponsorCarouselRef}
            data={sponsorAds}
            renderItem={renderAdItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth * 0.9}
            containerCustomStyle={{ height: 202 }}
            vertical={false}
            loop
            autoplay
            autoplayInterval={3000}
            autoplayDelay={500}
          />
        </View>

        {/* 2. Quick Links Section */}
        <View style={styles.quickLinksContainer}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.quickLinksGrid}>
            {quickLinks.map(link => (
              <TouchableOpacity key={link.id} style={styles.quickLinkItem}>
                <View
                  style={[
                    styles.quickLinkIcon,
                    { backgroundColor: link.color },
                  ]}
                >
                  <Feather name={link.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.quickLinkText}>{link.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Important Announcements Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Important Announcements</Text>
          {importantAnnouncements.map(announcement => (
            <TouchableOpacity
              key={announcement.id}
              style={styles.announcementCard}
            >
              <View
                style={[
                  styles.announcementIcon,
                  { backgroundColor: `${announcement.color}20` },
                ]}
              >
                <Feather
                  name={announcement.icon}
                  size={24}
                  color={announcement.color}
                />
              </View>
              <View style={styles.announcementContent}>
                <Text style={styles.announcementTitle}>
                  {announcement.title}
                </Text>
                <Text style={styles.announcementDescription}>
                  {announcement.description}
                </Text>
                <View style={styles.announcementFooter}>
                  <Text style={styles.announcementDate}>
                    {announcement.date}
                  </Text>
                  <View
                    style={[
                      styles.announcementCategory,
                      { backgroundColor: `${announcement.color}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.announcementCategoryText,
                        { color: announcement.color },
                      ]}
                    >
                      {announcement.category}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Academic Calendar Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Academic Calendar</Text>
          {academicCalendar.map(event => (
            <TouchableOpacity key={event.id} style={styles.calendarCard}>
              <View
                style={[
                  styles.calendarIcon,
                  { backgroundColor: `${event.color}20` },
                ]}
              >
                <Feather name={event.icon} size={24} color={event.color} />
              </View>
              <View style={styles.calendarContent}>
                <Text style={styles.calendarTitle}>{event.title}</Text>
                <View style={styles.calendarDates}>
                  <Text style={styles.calendarDate}>
                    {event.startDate} - {event.endDate}
                  </Text>
                  <View
                    style={[
                      styles.calendarStatus,
                      { backgroundColor: `${event.color}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.calendarStatusText,
                        { color: event.color },
                      ]}
                    >
                      {event.status}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 5. Popular Programs Section */}
        <View style={styles.programsContainer}>
          <Text style={styles.sectionTitle}>Popular Programs</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularPrograms.map(program => (
              <TouchableOpacity key={program.id} style={styles.programCard}>
                <View
                  style={[
                    styles.programIcon,
                    { backgroundColor: `${program.color}20` },
                  ]}
                >
                  <Feather
                    name={program.icon}
                    size={24}
                    color={program.color}
                  />
                </View>
                <Text style={styles.programTitle}>{program.title}</Text>
                <Text style={styles.programDepartment}>
                  {program.department}
                </Text>
                <View style={styles.programDurationContainer}>
                  <Feather
                    name="clock"
                    size={14}
                    color="#666"
                    style={styles.durationIcon}
                  />
                  <Text style={styles.programDuration}>{program.duration}</Text>
                </View>
                <View style={styles.programFooter}>
                  <Text style={styles.applyText}>Apply Now</Text>
                  <Feather name="arrow-right" size={16} color="#01848F" />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 6. Research Centers Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Research Centers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {researchCenters.map(center => (
              <TouchableOpacity key={center.id} style={styles.researchCard}>
                <View
                  style={[
                    styles.researchIconContainer,
                    { backgroundColor: `${center.color}20` },
                  ]}
                >
                  <Feather name={center.icon} size={28} color={center.color} />
                </View>
                <View style={styles.researchContent}>
                  <Text style={styles.researchTitle}>{center.title}</Text>
                  <View style={styles.researchInfo}>
                    <Feather
                      name="user"
                      size={14}
                      color="#666"
                      style={styles.researchInfoIcon}
                    />
                    <Text style={styles.researchDirector}>
                      {center.director}
                    </Text>
                  </View>
                  <View style={styles.researchInfo}>
                    <Feather
                      name="target"
                      size={14}
                      color="#666"
                      style={styles.researchInfoIcon}
                    />
                    <Text style={styles.researchFocus}>{center.focus}</Text>
                  </View>
                  <View style={styles.researchFooter}>
                    <Text style={styles.researchMore}>Learn More</Text>
                    <Feather name="arrow-right" size={16} color="#01848F" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 7. Research Achievements Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Research Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {researchAchievements.map(achievement => (
              <TouchableOpacity
                key={achievement.id}
                style={styles.researchCard}
              >
                <View
                  style={[
                    styles.researchIconContainer,
                    { backgroundColor: `${achievement.color}20` },
                  ]}
                >
                  <Feather
                    name={achievement.icon}
                    size={28}
                    color={achievement.color}
                  />
                </View>
                <View style={styles.researchContent}>
                  <Text style={styles.researchTitle}>{achievement.title}</Text>
                  <Text style={styles.researchFocus}>
                    {achievement.description}
                  </Text>
                  <View style={styles.researchFooter}>
                    <Text style={styles.researchMore}>Learn More</Text>
                    <Feather name="arrow-right" size={16} color="#01848F" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 8. International Collaborations Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              International Collaborations
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {internationalCollaborations.map(collaboration => (
              <TouchableOpacity
                key={collaboration.id}
                style={styles.collaborationCard}
              >
                <Image
                  source={{ uri: collaboration.image }}
                  style={styles.collaborationImage}
                />
                <View style={styles.collaborationContent}>
                  <View
                    style={[
                      styles.collaborationIcon,
                      { backgroundColor: `${collaboration.color}20` },
                    ]}
                  >
                    <Feather
                      name={collaboration.icon}
                      size={24}
                      color={collaboration.color}
                    />
                  </View>
                  <Text style={styles.collaborationTitle}>
                    {collaboration.title}
                  </Text>
                  <Text style={styles.collaborationDescription}>
                    {collaboration.description}
                  </Text>
                  <Text style={styles.collaborationDetails}>
                    {collaboration.details}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 9. Research Publications Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Research Publications</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {researchPublications.map(publication => (
            <TouchableOpacity
              key={publication.id}
              style={styles.publicationCard}
            >
              <Image
                source={{ uri: publication.image }}
                style={styles.publicationImage}
              />
              <View style={styles.publicationContent}>
                <Text style={styles.publicationTitle}>{publication.title}</Text>
                <Text style={styles.publicationAuthors}>
                  {publication.authors}
                </Text>
                <Text style={styles.publicationJournal}>
                  {publication.journal}
                </Text>
                <View style={styles.publicationFooter}>
                  <Text style={styles.publicationDate}>{publication.date}</Text>
                  <View
                    style={[
                      styles.publicationCategory,
                      { backgroundColor: '#E6F7FF' },
                    ]}
                  >
                    <Text style={styles.publicationCategoryText}>
                      {publication.category}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 10. Student Testimonials Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Student Testimonials</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {studentTestimonials.map(testimonial => (
              <TouchableOpacity
                key={testimonial.id}
                style={styles.testimonialCard}
              >
                <Image
                  source={{ uri: testimonial.image }}
                  style={styles.testimonialImage}
                />
                <View style={styles.testimonialContent}>
                  <Text style={styles.testimonialName}>{testimonial.name}</Text>
                  <Text style={styles.testimonialProgram}>
                    {testimonial.program}
                  </Text>
                  <Text style={styles.testimonialText}>
                    {testimonial.testimonial}
                  </Text>
                  <View style={styles.testimonialRating}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Feather key={i} name="star" size={16} color="#FFC107" />
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 11. Campus Life Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Campus Life</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {campusLife.map(item => (
              <TouchableOpacity key={item.id} style={styles.campusLifeCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.campusLifeImage}
                />
                <View style={styles.campusLifeContent}>
                  <View
                    style={[
                      styles.campusLifeIcon,
                      { backgroundColor: `${item.color}20` },
                    ]}
                  >
                    <Feather name={item.icon} size={24} color={item.color} />
                  </View>
                  <Text style={styles.campusLifeTitle}>{item.title}</Text>
                  <Text style={styles.campusLifeDescription}>
                    {item.description}
                  </Text>
                  <View style={styles.campusLifeActivities}>
                    {item.activities.map((activity, index) => (
                      <View
                        key={index}
                        style={[
                          styles.activityTag,
                          { backgroundColor: `${item.color}20` },
                        ]}
                      >
                        <Text
                          style={[styles.activityText, { color: item.color }]}
                        >
                          {activity}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 12. Virtual Tour Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Virtual Tour</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Start Tour</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {virtualTour.map(tour => (
              <TouchableOpacity key={tour.id} style={styles.tourCard}>
                <Image source={{ uri: tour.image }} style={styles.tourImage} />
                <View style={styles.tourContent}>
                  <View
                    style={[
                      styles.tourIcon,
                      { backgroundColor: `${tour.color}20` },
                    ]}
                  >
                    <Feather name={tour.icon} size={24} color={tour.color} />
                  </View>
                  <Text style={styles.tourTitle}>{tour.title}</Text>
                  <Text style={styles.tourDescription}>{tour.description}</Text>
                  <View style={styles.tourInfo}>
                    <View
                      style={[
                        styles.tourDuration,
                        { backgroundColor: `${tour.color}20` },
                      ]}
                    >
                      <Feather name="clock" size={14} color={tour.color} />
                      <Text
                        style={[styles.durationText, { color: tour.color }]}
                      >
                        {tour.duration}
                      </Text>
                    </View>
                    <View style={styles.tourPoints}>
                      {tour.points.map((point, index) => (
                        <View key={index} style={styles.tourPoint}>
                          <Feather name="check" size={14} color={tour.color} />
                          <Text style={styles.pointText}>{point}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 13. Alumni Success Stories Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Alumni Success Stories</Text>
          {alumniStories.map(alumni => (
            <TouchableOpacity key={alumni.id} style={styles.alumniCard}>
              <Image
                source={{ uri: alumni.image }}
                style={styles.alumniImage}
              />
              <View style={styles.alumniContent}>
                <View
                  style={[
                    styles.alumniIcon,
                    { backgroundColor: `${alumni.color}20` },
                  ]}
                >
                  <Feather name={alumni.icon} size={24} color={alumni.color} />
                </View>
                <Text style={styles.alumniName}>{alumni.name}</Text>
                <Text style={styles.alumniGraduation}>{alumni.graduation}</Text>
                <Text style={styles.alumniCurrent}>{alumni.current}</Text>
                <Text style={styles.alumniQuote}>"{alumni.quote}"</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 14. Community Engagement Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Engagement</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {communityEngagement.map(program => (
              <TouchableOpacity key={program.id} style={styles.researchCard}>
                <View
                  style={[
                    styles.researchIconContainer,
                    { backgroundColor: `${program.color}20` },
                  ]}
                >
                  <Feather
                    name={program.icon}
                    size={28}
                    color={program.color}
                  />
                </View>
                <View style={styles.researchContent}>
                  <Text style={styles.researchTitle}>{program.title}</Text>
                  <Text style={styles.researchFocus}>
                    {program.description}
                  </Text>
                  <View style={styles.researchFooter}>
                    <Text style={styles.researchMore}>Learn More</Text>
                    <Feather name="arrow-right" size={16} color="#01848F" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 15. Academic Departments Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Academic Departments</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {academicDepartments.map(department => (
              <TouchableOpacity
                key={department.id}
                style={styles.departmentCard}
              >
                <Image
                  source={{ uri: department.image }}
                  style={styles.departmentImage}
                />
                <View style={styles.departmentContent}>
                  <View
                    style={[
                      styles.departmentIcon,
                      { backgroundColor: `${department.color}20` },
                    ]}
                  >
                    <Feather
                      name={department.icon}
                      size={24}
                      color={department.color}
                    />
                  </View>
                  <Text style={styles.departmentTitle}>{department.title}</Text>
                  <Text style={styles.departmentDescription}>
                    {department.description}
                  </Text>

                  <View style={styles.departmentStats}>
                    <View style={styles.statItem}>
                      <Feather name="users" size={14} color="#666" />
                      <Text style={styles.statText}>
                        {department.stats.students}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Feather name="award" size={14} color="#666" />
                      <Text style={styles.statText}>
                        {department.stats.faculty}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Feather name="book" size={14} color="#666" />
                      <Text style={styles.statText}>
                        {department.stats.research}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.departmentProgramsContainer}>
                    {department.featuredPrograms.map((program, index) => (
                      <View
                        key={index}
                        style={[
                          styles.programTag,
                          { backgroundColor: `${department.color}20` },
                        ]}
                      >
                        <Text
                          style={[
                            styles.programText,
                            { color: department.color },
                          ]}
                        >
                          {program}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.departmentFooter}>
                    <Text style={styles.programsText}>
                      {department.programs}
                    </Text>
                    <Feather name="arrow-right" size={16} color="#01848F" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 16. Student Services Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Student Services</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.servicesGrid}>
            {studentServices.map(service => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <View
                  style={[
                    styles.serviceIcon,
                    { backgroundColor: `${service.color}20` },
                  ]}
                >
                  <Feather
                    name={service.icon}
                    size={24}
                    color={service.color}
                  />
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceContact}>{service.contact}</Text>
                <Text style={styles.serviceHours}>{service.hours}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 17. Faculty Highlights Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Faculty Highlights</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {facultyHighlights.map(faculty => (
              <TouchableOpacity key={faculty.id} style={styles.facultyCard}>
                <Image
                  source={{ uri: faculty.image }}
                  style={styles.facultyImage}
                />
                <View style={styles.facultyInfo}>
                  <Text style={styles.facultyName}>{faculty.name}</Text>
                  <Text style={styles.facultyDesignation}>
                    {faculty.designation}
                  </Text>
                  <Text style={styles.facultyAchievement}>
                    {faculty.achievement}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 22. Student Clubs Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Student Clubs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {studentClubs.map(club => (
              <TouchableOpacity key={club.id} style={styles.clubCard}>
                <Image source={{ uri: club.image }} style={styles.clubImage} />
                <View style={styles.clubContent}>
                  <View
                    style={[
                      styles.clubIcon,
                      { backgroundColor: `${club.color}20` },
                    ]}
                  >
                    <Feather name={club.icon} size={24} color={club.color} />
                  </View>
                  <Text style={styles.clubName}>{club.name}</Text>
                  <Text style={styles.clubDescription}>{club.description}</Text>
                  <View style={styles.clubActivities}>
                    {club.activities.map((activity, index) => (
                      <View
                        key={index}
                        style={[
                          styles.activityTag,
                          { backgroundColor: `${club.color}20` },
                        ]}
                      >
                        <Text
                          style={[styles.activityText, { color: club.color }]}
                        >
                          {activity}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.clubFooter}>
                    <Text style={styles.clubMembers}>
                      {club.members} members
                    </Text>
                    <Text style={styles.clubEvent}>{club.upcomingEvent}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 23. Faculty Achievements Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Faculty Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {facultyAchievements.map(achievement => (
              <TouchableOpacity
                key={achievement.id}
                style={styles.facultyAchievementCard}
              >
                <View style={styles.facultyAchievementImageContainer}>
                  <Image
                    source={{ uri: achievement.image }}
                    style={styles.facultyAchievementImage}
                  />
                  <View style={styles.facultyAchievementBadge}>
                    <Feather name="award" size={16} color="#FFC107" />
                  </View>
                </View>
                <View style={styles.facultyAchievementContent}>
                  <Text style={styles.facultyAchievementName}>
                    {achievement.name}
                  </Text>
                  <Text style={styles.facultyAchievementRole}>
                    {achievement.designation}
                  </Text>
                  <View style={styles.facultyAchievementDivider} />
                  <Text style={styles.facultyAchievementAward}>
                    {achievement.achievement}
                  </Text>
                  <Text style={styles.facultyAchievementDescription}>
                    {achievement.details}
                  </Text>
                  <View style={styles.facultyAchievementFooter}>
                    <View style={styles.facultyAchievementDateContainer}>
                      <Feather name="calendar" size={14} color="#666" />
                      <Text style={styles.facultyAchievementDate}>
                        {achievement.date}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.facultyAchievementButton}>
                      <Text style={styles.facultyAchievementButtonText}>
                        View Details
                      </Text>
                      <Feather name="arrow-right" size={14} color="#01848F" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 24. Campus News Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Campus News</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {campusNews.map(news => (
            <TouchableOpacity key={news.id} style={styles.newsCard}>
              <Image source={{ uri: news.image }} style={styles.newsImage} />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{news.title}</Text>
                <Text style={styles.newsDescription}>{news.description}</Text>
                <View style={styles.newsFooter}>
                  <Text style={styles.newsDate}>{news.date}</Text>
                  <View
                    style={[
                      styles.newsCategory,
                      { backgroundColor: '#E6F7FF' },
                    ]}
                  >
                    <Text style={styles.newsCategoryText}>{news.category}</Text>
                  </View>
                  <Text style={styles.newsReadTime}>{news.readTime}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

////////////////////////////////////////
// STYLES
////////////////////////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerWrapper: { backgroundColor: '#01848F' },
  headerContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: { flex: 1, marginRight: 12 },
  locationTitleRow: { flexDirection: 'row', alignItems: 'center' },
  locationTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  locationSubtitle: { color: '#fff', fontSize: 12, marginTop: 2, opacity: 0.9 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  searchContainer: { marginTop: 10 },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 6 : 0,
  },
  searchInput: { flex: 1, marginLeft: 6, fontSize: 14, color: '#333' },
  searchLoader: { marginRight: 8 },
  clearButton: { marginLeft: 8, padding: 4 },
  bodyContainer: { flex: 1 },
  /////////////////////////////////////
  // Sponsored Ads
  /////////////////////////////////////
  sponsoredContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F8F9FAF7',
  },
  sponsorHeading: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: '#333',
    width: '100%',
    textAlign: 'left',
  },
  sponsorHeadingLabel: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 28,
    marginBottom: 14,
  },
  adCard: { borderRadius: 8, overflow: 'hidden' },
  adImage: { width: '100%', height: 202, resizeMode: 'cover' },
  /////////////////////////////////////
  // Top Rated Services
  /////////////////////////////////////
  topRatedContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  topRatedHeading: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: '#333',
    marginBottom: 18,
    width: '100%',
    textAlign: 'left',
  },
  cardContainer: {
    minHeight: 212,
    height: 212,
    flexDirection: 'row',
    borderRadius: 27.82,
    overflow: 'hidden',
    padding: 16,
  },
  leftSide: { flex: 1, justifyContent: 'space-around' },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  topRatedLabel: { fontSize: 14, color: '#333' },
  topRatedNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
  },
  rightSide: { justifyContent: 'center', alignItems: 'flex-end', width: 120 },
  /////////////////////////////////////
  // New to Podium
  /////////////////////////////////////
  leftColumn: { flex: 1, justifyContent: 'space-between' },
  newLabel: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  newLabelText: { fontSize: 14, fontWeight: '400', color: '#333' },
  tagLabel: {
    backgroundColor: '#EF4581',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  tagLabelText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#fff',
  },
  orgNametagLabel: {
    backgroundColor: '#01848F',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  orgName: { fontSize: 14, fontWeight: '400', color: '#333', marginBottom: 4 },
  personName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  jobsCompleted: { fontSize: 14, color: '#333' },
  jobsCompletedCount: { fontSize: 25, color: '#333', marginBottom: 4 },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ratingText: { fontSize: 14, color: '#333' },
  /////////////////////////////////////
  // Right Column (Person Image)
  /////////////////////////////////////
  rightColumn: { justifyContent: 'center', alignItems: 'flex-end', width: 120 },
  personImage: { marginTop: 10, width: 165, height: 200, resizeMode: 'cover' },
  quickLinksContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickLinkItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickLinkIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickLinkText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  programsContainer: {
    padding: 16,
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  programCard: {
    width: 220,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  programIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  programDepartment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  programDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  durationIcon: {
    marginRight: 6,
  },
  programDuration: {
    fontSize: 12,
    color: '#666',
  },
  programFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  applyText: {
    fontSize: 14,
    color: '#01848F',
    fontWeight: '500',
  },
  newsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  newsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  newsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsDate: {
    fontSize: 12,
    color: '#999',
    marginRight: 12,
  },
  newsCategory: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newsCategoryText: {
    fontSize: 12,
    color: '#01848F',
  },
  sectionContainer: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#01848F',
    fontSize: 14,
    fontWeight: '500',
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventDateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  eventDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  eventTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventMetaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  eventCategory: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  eventCategoryText: {
    fontSize: 12,
    color: '#01848F',
  },
  facultyCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  facultyImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  facultyInfo: {
    padding: 12,
  },
  facultyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  facultyDesignation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  facultyAchievement: {
    fontSize: 12,
    color: '#01848F',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  facilityCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  facilityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  facilityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  facilityDescription: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  departmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  departmentCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  departmentImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  departmentContent: {
    padding: 16,
  },
  departmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  departmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  departmentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  departmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  departmentProgramsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  programTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  programText: {
    fontSize: 12,
    fontWeight: '500',
  },
  departmentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  programsText: {
    fontSize: 14,
    color: '#01848F',
    fontWeight: '500',
  },
  researchCard: {
    width: 280,
    // backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  researchIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  researchContent: {
    flex: 1,
  },
  researchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  researchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  researchInfoIcon: {
    marginRight: 8,
  },
  researchDirector: {
    fontSize: 14,
    color: '#666',
  },
  researchFocus: {
    fontSize: 14,
    color: '#666',
  },
  researchFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  researchMore: {
    fontSize: 14,
    color: '#01848F',
    fontWeight: '500',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  serviceContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  serviceHours: {
    fontSize: 12,
    color: '#01848F',
  },
  achievementCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  achievementImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  achievementContent: {
    padding: 16,
  },
  achievementName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  achievementProgram: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  achievementDate: {
    fontSize: 12,
    color: '#01848F',
  },
  calendarCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  calendarContent: {
    flex: 1,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  calendarDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarDate: {
    fontSize: 14,
    color: '#666',
  },
  calendarStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  calendarStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  announcementCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  announcementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  announcementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  announcementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  announcementDate: {
    fontSize: 12,
    color: '#666',
  },
  announcementCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  announcementCategoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  campusLifeCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  campusLifeImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  campusLifeContent: {
    padding: 16,
  },
  campusLifeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  campusLifeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  campusLifeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  campusLifeActivities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  alumniCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alumniImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  alumniContent: {
    flex: 1,
  },
  alumniIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  alumniName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  alumniGraduation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  alumniCurrent: {
    fontSize: 14,
    color: '#01848F',
    marginBottom: 8,
  },
  alumniQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
  tourCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tourImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  tourContent: {
    padding: 16,
  },
  tourIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tourTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tourDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tourInfo: {
    gap: 12,
  },
  tourDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  tourPoints: {
    gap: 8,
  },
  tourPoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  collaborationCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  collaborationImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  collaborationContent: {
    padding: 16,
  },
  collaborationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  collaborationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  collaborationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  collaborationDetails: {
    fontSize: 12,
    color: '#01848F',
  },
  publicationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  publicationImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  publicationContent: {
    flex: 1,
  },
  publicationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  publicationAuthors: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  publicationJournal: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  publicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  publicationDate: {
    fontSize: 12,
    color: '#666',
  },
  publicationCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  publicationCategoryText: {
    fontSize: 12,
    color: '#01848F',
  },
  testimonialCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  testimonialImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  testimonialContent: {
    padding: 16,
  },
  testimonialName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  testimonialProgram: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  testimonialText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  testimonialRating: {
    flexDirection: 'row',
  },
  clubCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  clubImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  clubContent: {
    padding: 16,
  },
  clubIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  clubName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  clubActivities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  activityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  clubFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clubMembers: {
    fontSize: 12,
    color: '#666',
  },
  clubEvent: {
    fontSize: 12,
    color: '#01848F',
    fontWeight: '500',
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsDate: {
    fontSize: 12,
    color: '#666',
  },
  newsCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newsCategoryText: {
    fontSize: 12,
    color: '#01848F',
  },
  newsReadTime: {
    fontSize: 12,
    color: '#666',
  },
  facultyAchievementCard: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  facultyAchievementImageContainer: {
    position: 'relative',
    height: 180,
  },
  facultyAchievementImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  facultyAchievementBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  facultyAchievementContent: {
    padding: 16,
  },
  facultyAchievementName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  facultyAchievementRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  facultyAchievementDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  facultyAchievementAward: {
    fontSize: 16,
    fontWeight: '500',
    color: '#01848F',
    marginBottom: 8,
  },
  facultyAchievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  facultyAchievementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  facultyAchievementDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facultyAchievementDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  facultyAchievementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  facultyAchievementButtonText: {
    fontSize: 12,
    color: '#01848F',
    marginRight: 4,
    fontWeight: '500',
  },
});
