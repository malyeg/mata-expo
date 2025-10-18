import { Timestamp } from "@react-native-firebase/firestore";

function timeAgo(date: Date | Timestamp): string {
  if (date instanceof Timestamp) {
    date = date.toDate();
  } else if (!(date instanceof Date)) {
    throw new Error("Invalid date type. Expected Date or Timestamp.");
  }
  const ms = new Date().getTime() - date.getTime();
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (ms === 0) {
    return "Just now";
  }
  if (seconds < 60) {
    return seconds + " seconds";
  }
  if (minutes < 60) {
    return minutes + " minutes";
  }
  if (hours < 24) {
    return hours + " hours";
  }
  if (days < 30) {
    return days + " days";
  }
  if (months < 12) {
    return months + " months";
  } else {
    return years + " years";
  }
}

export default timeAgo;
export { timeAgo };
