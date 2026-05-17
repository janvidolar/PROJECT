const getStatus = (eventDate, eventTime) => {
  const now = new Date();

  const eventStart = new Date(`${eventDate.split("T")[0]}T${eventTime}`);

  const eventEnd = new Date(`${eventDate.split("T")[0]}T23:59:59`);

  if (now < eventStart) return "UPCOMING";

  if (now >= eventStart && now <= eventEnd) return "LIVE";

  return "COMPLETED";
};

export default getStatus;
