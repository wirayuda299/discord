const roundDown = (value: number) => Math.floor(value);

export const getCreatedDate = (createdAt: Date) => {
  try {
    const now = Date.now();
    const diff = now - new Date(createdAt).getTime();

    const diffInSeconds = diff / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    const diffInWeeks = diffInDays / 7;
    const diffInMonths = diffInDays / 30;
    const diffInYears = diffInDays / 365;

    switch (true) {
      case diffInSeconds < 60:
        return "just now";
      case diffInMinutes < 60:
        return `${roundDown(diffInMinutes)} ${
          roundDown(diffInMinutes) > 1 ? "minutes" : "minute"
        } ago`;
      case diffInHours < 24:
        return `${roundDown(diffInHours)} ${
          roundDown(diffInHours) > 1 ? "hours" : "hour"
        } ago`;
      case diffInDays < 7:
        return `${roundDown(diffInDays)} ${
          roundDown(diffInDays) > 1 ? "days" : "day"
        } ago`;
      case diffInWeeks < 4:
        return `${roundDown(diffInWeeks)} ${
          roundDown(diffInWeeks) > 1 ? "weeks" : "week"
        } ago`;
      case diffInMonths < 12:
        return `${roundDown(diffInMonths)} ${
          roundDown(diffInMonths + 1) > 1 ? "months" : "month"
        } ago`;
      default:
        return `${roundDown(diffInYears)} ${
          roundDown(diffInYears) > 1 ? "years" : "year"
        } ago`;
    }
  } catch (error: any) {
    console.log(error.message);
  }
};
