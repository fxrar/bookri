export const convertDurationToMinutes = (duration) => {
  if (!duration) return 0;

  try {
    const unit = duration.slice(-1).toUpperCase();
    const value = parseFloat(duration.slice(0, -1));

    if (isNaN(value)) return 0;

    switch (unit) {
      case 'H':
        return value * 60;
      case 'M':
        return value;
      default:
        return 0;
    }
  } catch (error) {
    console.error('Error converting duration to minutes:', error);
    return 0;
  }
};

export const formatDurationForDisplay = (duration) => {
  if (!duration) return '0 minutes';

  const minutes = convertDurationToMinutes(duration);
  return minutes === 1 ? '1 minute' : `${minutes} minutes`;
};
