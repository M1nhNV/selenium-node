import moment from 'moment';

const getCurrentTimeUTC = () => {
  return moment().utc().toISOString();
};

function getCurrentDate(format = 'YYYY/MM/DD') {
  return moment().format(format);
}

const convertTime = (time, type = 's') => {
  return `${Math.round(time / 1000)}${type}`;
};

const getMinDate = (dates, format = 'YYYY/MM/DD') => {
  const d = new Date(
    Math.min(
      ...dates.map((el) => {
        console.log(el);
        return new Date(el);
      })
    )
  );

  return moment(d).format(format);
};

const getMaxDate = (dates, format = 'YYYY/MM/DD') => {
  const d = new Date(
    Math.max(
      ...dates.map((el) => {
        return new Date(el);
      })
    )
  );

  return moment(d).format(format);
};

const plusDate = (date, number, format = 'YYYY/MM/DD') => {
  const d = new Date(date);
  return moment(d).add(number, 'd').format(format);
};

const isDateBetween = (date, startDate, endDate) => {
  const newDate = new Date(date);
  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

  return moment(newDate).isBetween(newStartDate, newEndDate);
};

const filterDateValid = (dates) => {
  return dates.filter((date) => {
    const d = new Date(date);
    if (moment(d).isValid()) {
      return date;
    }
  });
};

async function isSameOrBefore(dates = [], target) {
  return dates.every((date) => moment(new Date(date)).isSameOrBefore(new Date(target)));
}

async function isSameOrAfter(dates = [], target) {
  return dates.every((date) => moment(new Date(date)).isSameOrAfter(new Date(target)));
}

export {
  getCurrentTimeUTC,
  getCurrentDate,
  getMinDate,
  getMaxDate,
  plusDate,
  isDateBetween,
  convertTime,
  filterDateValid,
  isSameOrBefore,
  isSameOrAfter,
};
