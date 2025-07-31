import { StyleSheet } from 'react-native';

export const lightTheme = {
  background: '#ECE5DD',
  headerBackground: '#075E54',
  bubbleBackground: '#DCF8C6',
  bubbleBackgroundOther: '#FFFFFF',
  text: '#000000',
  secondaryText: '#8C8C8C',
  inputBackground: '#FFFFFF',
  sendButtonColor: '#075E54',
};

export const darkTheme = {
  background: '#0D1F23',
  headerBackground: '#1F2C34',
  bubbleBackground: '#005C4B',
  bubbleBackgroundOther: '#1F2C34',
  text: '#FFFFFF',
  secondaryText: '#8C8C8C',
  inputBackground: '#1F2C34',
  sendButtonColor: '#00A884',
};

export const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: theme.headerBackground,
    },
    backButton: {
      padding: 8,
    },
    contactInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    contactImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    contactName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    moreButton: {
      padding: 8,
    },
    messageList: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    messageBubble: {
      maxWidth: '80%',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: theme.bubbleBackground,
      borderTopRightRadius: 0,
    },
    contactMessage: {
      alignSelf: 'flex-start',
      backgroundColor: theme.bubbleBackgroundOther,
      borderTopLeftRadius: 0,
    },
    messageText: {
      fontSize: 16,
      color: theme.text,
    },
    timestamp: {
      fontSize: 12,
      color: theme.secondaryText,
      alignSelf: 'flex-end',
      marginTop: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      backgroundColor: theme.inputBackground,
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 120,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.inputBackground,
    },
    sendButton: {
      padding: 8,
    },
    quoteContainer: {
      borderLeftWidth: 4,
      borderLeftColor: theme.sendButtonColor,
      paddingLeft: 8,
      marginBottom: 8,
      backgroundColor: theme.bubbleBackgroundOther,
      borderRadius: 8,
      padding: 8,
    },
    quoteText: {
      fontSize: 14,
      color: theme.secondaryText,
    },
    ctaContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    ctaButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: theme.sendButtonColor,
    },
    ctaButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
  });
