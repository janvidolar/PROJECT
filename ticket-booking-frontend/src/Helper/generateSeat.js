const generateSeats = (totalSeats) => {
  const seats = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]; 

  let count = 0;

  for (let r = 0; r < rows.length; r++) {
    for (let n = 1; n <= 10; n++) {  // 10 seats per row
      if (count >= totalSeats) return seats;

      seats.push({
        number: `${rows[r]}${n}`,
        isBooked: false,
        isLocked: false
      });

      count++;
    }
  }

  return seats;
};

export default generateSeats