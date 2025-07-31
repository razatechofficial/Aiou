import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');
const contentWidth = width - 46; // 23px padding on each side

const QuoteSheet = () => {
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('£00.00');

  const CategoryButton = ({title, value, width = 141}) => {
    const isSelected = category === value;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setCategory(value)}
        style={[styles.categoryButtonWrapper, {width}]}>
        {isSelected ? (
          <LinearGradient
            colors={['rgba(239, 69, 129, 0.2)', 'rgba(239, 69, 129, 0.2)']}
            style={[
              styles.categoryButton,
              styles.selectedCategoryButton,
              {width},
            ]}>
            <Text style={styles.selectedCategoryText}>{title}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.categoryButton, {width}]}>
            <Text style={styles.categoryText}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Icon
          name="file-text"
          size={26}
          color="#000"
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>Make a Quote</Text>
      </View>

      <View style={styles.divider} />

      {/* Category Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <Text style={styles.sectionSubtitle}>
          Choose what you are requesting a quote for
        </Text>

        <View style={styles.categoryContainer}>
          <CategoryButton
            title="Call Out Charges"
            value="callout"
            width={141}
          />
          <CategoryButton title="Other" value="other" width={83} />
          <CategoryButton title="Service" value="service" width={141} />
          <CategoryButton title="Lorem" value="lorem" width={111} />
        </View>
      </View>

      <View style={styles.divider} />

      {/* Service Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service</Text>
        <Text style={styles.sectionSubtitle}>
          Provide the service you are offering
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.serviceInput}
            placeholder="Write Service....."
            placeholderTextColor="#595959"
            value={service}
            onChangeText={setService}
          />
        </View>
      </View>

      <View style={styles.divider} />

      {/* Quote Payment Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quote Payment</Text>
        <Text style={styles.sectionSubtitle}>
          Provide the payment amount for your quote
        </Text>

        <View style={styles.amountInputContainer}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Send Button */}
      <TouchableOpacity style={styles.sendButton} activeOpacity={0.8}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 23,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Montserrat' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '500' : '700',
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#CACCCE',
    width: '100%',
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 23,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Montserrat' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '500' : '700',
    fontSize: 18,
    lineHeight: 22,
    color: '#000000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '500' : '400',
    fontSize: 11,
    lineHeight: 13,
    color: '#595959',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  categoryButtonWrapper: {
    marginRight: 10,
    marginBottom: 12,
    height: 37.6,
    borderRadius: 10.25,
    // Add shadow for Android
    ...Platform.select({
      android: {
        elevation: 15,
      },
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {width: 0, height: 3.4},
        shadowOpacity: 0.8,
        shadowRadius: 17,
      },
    }),
  },
  categoryButton: {
    borderWidth: 0.85,
    borderColor: 'rgba(1, 132, 143, 0.71)',
    borderRadius: 10.25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  selectedCategoryButton: {
    borderColor: '#EF4581',
    // No need for background color as LinearGradient handles it
  },
  categoryText: {
    fontFamily: Platform.OS === 'ios' ? 'Montserrat' : 'Roboto',
    fontWeight: '500',
    fontSize: 11.96,
    lineHeight: 15,
    textAlign: 'center',
    color: '#000000',
  },
  selectedCategoryText: {
    fontFamily: Platform.OS === 'ios' ? 'Montserrat' : 'Roboto',
    fontWeight: '500',
    fontSize: 11.96,
    lineHeight: 15,
    textAlign: 'center',
    color: '#EF4581',
  },
  inputContainer: {
    width: contentWidth,
    height: 38,
    borderWidth: 0.8,
    borderColor: '#01848F',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    // Add shadow for Android
    ...Platform.select({
      android: {
        elevation: 10,
      },
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 4,
      },
    }),
  },
  serviceInput: {
    height: 38,
    paddingHorizontal: 18,
    fontFamily: Platform.OS === 'ios' ? 'Montserrat' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '500' : '400',
    fontSize: 11,
    color: '#595959',
  },
  amountInputContainer: {
    width: 98,
    height: 38,
    borderWidth: 0.8,
    borderColor: '#01848F',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    // Add shadow for Android
    ...Platform.select({
      android: {
        elevation: 6,
      },
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 4,
      },
    }),
  },
  amountInput: {
    height: 38,
    paddingHorizontal: 18,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '500' : '700',
    fontSize: 16,
    color: '#595959',
  },
  sendButton: {
    backgroundColor: '#EF4581',
    borderRadius: 8,
    height: 52,
    marginHorizontal: 36,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Montserrat' : 'Roboto',
    fontWeight: Platform.OS === 'ios' ? '600' : '700',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default QuoteSheet;
