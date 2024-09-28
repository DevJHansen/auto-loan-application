export function isOlderThanThreeMonths(value: string): boolean {
  if (!value) {
    return false;
  }

  const inputDate = new Date(value);
  if (isNaN(inputDate.getTime())) {
    throw new Error('Invalid date format');
  }

  const currentDate = new Date();

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

  if (threeMonthsAgo.getMonth() > currentDate.getMonth()) {
    threeMonthsAgo.setFullYear(currentDate.getFullYear() - 1);
  }

  return inputDate < threeMonthsAgo;
}

export function areDatesAtLeastThreeMonthsApart(
  date1: string,
  date2: string
): boolean {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  if (isNaN(firstDate.getTime()) || isNaN(secondDate.getTime())) {
    return false;
  }

  const [earlierDate, laterDate] =
    firstDate < secondDate ? [firstDate, secondDate] : [secondDate, firstDate];

  const yearDifference = laterDate.getFullYear() - earlierDate.getFullYear();
  const monthDifference = laterDate.getMonth() - earlierDate.getMonth();
  const totalMonthsApart = yearDifference * 12 + monthDifference;

  return (
    totalMonthsApart >= 3 ||
    (totalMonthsApart === 2 && laterDate.getDate() >= earlierDate.getDate())
  );
}
