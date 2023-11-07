/**
 * get current time is UTC +0
 * @returns {Date}
 */
export const getCurrentTimeUTC = () => {
  const currentTimeUTC = new Date();
  return new Date(
    currentTimeUTC.getUTCFullYear(),
    currentTimeUTC.getUTCMonth(),
    currentTimeUTC.getUTCDate(),
    currentTimeUTC.getUTCHours(),
    currentTimeUTC.getUTCMinutes(),
    currentTimeUTC.getUTCSeconds(),
    currentTimeUTC.getUTCMilliseconds(),
  );
};
