import {toZonedTime, format} from 'date-fns-tz';
import {isToday, isYesterday, differenceInDays} from 'date-fns';

// Utility to get the local date
export const localDate = (utcTime: string): string => {
  if (!utcTime) return '';
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTime = toZonedTime(utcTime, timeZone);
  return format(localTime, 'MMMM dd, yyyy');
};

// Utility to get the local time
export const localTime = (utcTime: string): string => {
  if (!utcTime) return '';
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTime = toZonedTime(utcTime, timeZone);
  return format(localTime, 'hh:mm a');
};

// Utility to get relative time (Today, Yesterday, etc.)
export const relativeTime = (utcTime: string): string => {
  if (!utcTime) return '';
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTime = toZonedTime(utcTime, timeZone);

  if (isToday(localTime)) {
    return 'Today';
  } else if (isYesterday(localTime)) {
    return 'Yesterday';
  } else {
    const daysDifference = differenceInDays(new Date(), localTime);
    if (daysDifference <= 7) {
      // If within the past week, show the day of the week
      return format(localTime, 'EEEE');
    } else {
      // Show the full date if older than a week
      return format(localTime, 'MMMM dd, yyyy');
    }
  }
};

export const formattedTime = (utcTime: string): string => {
  if (!utcTime) {
    throw new Error('Invalid UTC time');
  }

  // Convert UTC time to the local time zone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTime = toZonedTime(utcTime, timeZone);

  // Format the local time (only time, not date)
  const formattedTime = format(localTime, 'hh:mm a');

  return formattedTime;
};
