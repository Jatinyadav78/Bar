export const formatDate = (dateString, requestData) => {
  const date = new Date(dateString);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const month = date.getMonth() + 1; // Adding 1 to month since it is zero-based
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours()% 12 || 12;
  const minutes = date.getMinutes() ;
  const second = date.getSeconds();
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  if(requestData){
  const formattedDate = `${day} ${monthName}, ${year}, ${hours? hours : 12}:${minutes < 10 ? '0' : ''}${minutes}:${second < 10 ? '0' : ''}${second} ${ampm}`;
  return formattedDate;
}
  return {
    day,
    date,
    year,
    month,
    monthName,
    hours,
    minutes,
    second,
    ampm,
  };
};

export const getTimeOfDay = (timestamp) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};
