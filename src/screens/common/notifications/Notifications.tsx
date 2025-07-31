import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = width - CARD_MARGIN * 2;

const NotificationCard = ({
  status,
  timeAgo,
  name,
  profession,
  servicesList,
  date,
  time,
  avatar,
  isCompleted,
  isRequest,
}) => (
  <TouchableOpacity style={styles.cardContainer} activeOpacity={0.9}>
    {/* Status Bar */}
    {status && (
      <View
        style={[
          styles.statusBar,
          {backgroundColor: isCompleted ? '#01848F' : '#EF4581'},
        ]}>
        <View style={styles.statusContent}>
          <Text style={styles.statusText}>
            {name} {status}
          </Text>
          <View style={styles.timeContainer}>
            {!isRequest && (
              <View style={styles.checkmarkContainer}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            )}
            <Text style={styles.statusTime}>{timeAgo}</Text>
          </View>
        </View>
        <Text style={styles.arrowIcon}>→</Text>
      </View>
    )}

    {/* Profile Section */}
    <View style={styles.profileSection}>
      <Image source={{uri: avatar}} style={styles.avatarImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.nameText}>{name}</Text>
        <View style={styles.professionTag}>
          <Text style={styles.professionText}>{profession}</Text>
        </View>
      </View>
    </View>

    {/* Details Section */}
    <View style={styles.detailsSection}>
      <View style={styles.detailsColumn}>
        <Text style={styles.sectionTitle}>Services List</Text>
        {servicesList.map((service, index) => (
          <Text key={index} style={styles.detailText}>
            {service}
          </Text>
        ))}
      </View>

      <View style={styles.detailsColumn}>
        <Text style={styles.sectionTitle}>Time</Text>
        <Text style={styles.detailText}>{date}</Text>
        <Text style={styles.detailText}>{time}</Text>
      </View>
    </View>

    {/* Request Footer */}
    {isRequest && (
      <View style={styles.requestFooter}>
        <Text style={styles.requestText}>{name} Sent a request!</Text>
        <TouchableOpacity style={styles.moreInfoButton}>
          <Text style={styles.moreInfoText}>More Info</Text>
          <Text style={styles.moreInfoArrow}>→</Text>
        </TouchableOpacity>
      </View>
    )}
  </TouchableOpacity>
);

const Notifications = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <NotificationCard
        status="Completed the job"
        timeAgo="3 hr ago"
        name="Jake"
        profession="Plumber"
        servicesList={['1x Faucet & Leak Repairs']}
        date="Oct, 05"
        time="04:20 PM — 06:00 PM"
        avatar="https://randomuser.me/api/portraits/men/1.jpg"
        isCompleted={true}
        isRequest={undefined}
      />

      <NotificationCard
        status="Started the job"
        timeAgo="1 hr ago"
        name="Jake Millers"
        profession="Plumber"
        servicesList={['1x Faucet & Leak Repairs']}
        date="Oct, 05"
        time="04:20 PM — 06:00 PM"
        avatar="https://randomuser.me/api/portraits/men/18.jpg"
        isCompleted={false}
        isRequest={undefined}
      />

      <NotificationCard
        name="Mike John"
        profession="Carpenter"
        servicesList={['Lorem ipsum dolor sit amet']}
        date="Oct, 05"
        time="02:00 PM — 04:00 PM"
        avatar="https://randomuser.me/api/portraits/men/12.jpg"
        isRequest={true}
        status={undefined}
        timeAgo={undefined}
        isCompleted={undefined}
      />

      <Text style={styles.sectionHeader}>Last Week</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  statusContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmarkContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusTime: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 12,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  professionTag: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  professionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  detailsSection: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
  },
  detailsColumn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  requestText: {
    fontSize: 14,
    color: '#64B5F6',
    fontWeight: '500',
  },
  moreInfoButton: {
    backgroundColor: '#FF4081',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  moreInfoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  moreInfoArrow: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
    padding: 16,
  },
});

export default Notifications;
