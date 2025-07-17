function timeAgo(date: Date) {
  var ms = new Date().getTime() - date.getTime();
  var seconds = Math.floor(ms / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var months = Math.floor(days / 30);
  var years = Math.floor(months / 12);

  if (ms === 0) {
    return 'Just now';
  }
  if (seconds < 60) {
    return seconds + ' seconds';
  }
  if (minutes < 60) {
    return minutes + ' minutes';
  }
  if (hours < 24) {
    return hours + ' hours';
  }
  if (days < 30) {
    return days + ' days';
  }
  if (months < 12) {
    return months + ' months';
  } else {
    return years + ' years';
  }
}

export default timeAgo;
export {timeAgo};
