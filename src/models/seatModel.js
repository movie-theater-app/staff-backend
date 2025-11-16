const db = require('../db/db');

// automatic column count based on typical auditorium sizes
function calculateColumns(seatCount) {
  if (seatCount <= 80) return 12;      // small auditorium
  if (seatCount <= 150) return 15;     // medium
  if (seatCount <= 200) return 18;     // large
  return 22;                           // very large (IMAX-scale)
}

// create seats for an auditorium in the database
async function createSeats(auditoriumId, seatCount) {
  // create layout width dynamically based on total seat count
  const columns = calculateColumns(seatCount);
  // row labels A-Z, up to 26 rows
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  // calculate how many rows are required, Math.ceil rounds up to nearest integer
  const rows = Math.ceil(seatCount / columns);
  const seats = []; // to store seat objects 
 // create seat objects row by row (inner loop for columns)
  for (let row = 0; row < rows; row++) {
    for (let column = 1; column <= columns; column++) {
       // count seat index (järjestysnumero) in the auditorium from row and column
      const seatNumber = row * columns + column;
      // don't create unnecessary seats, stops the inner loop from creating extra columns
      if (seatNumber > seatCount) break;

      seats.push({
        seat_row: rowLabels[row],
        seat_number: column,
        status: 'available' // initially available
      });
    }
  }

  try {
    // loop through each seat in the array to insert it into the database
    for (const seat of seats) {
      await db.query(
        `INSERT INTO seats (auditorium_id, seat_row, seat_number, status)
         VALUES ($1, $2, $3, $4)`,
        [auditoriumId, seat.seat_row, seat.seat_number, seat.status]
      );
    }
    return seats.length;
  } catch (err) {
    throw err;
  } finally {
  }
}

// Get all seats from specific auditorium
// ordered by row + seat number for proper seat-map rendering
async function getSeatsByAuditorium(auditoriumId) {
  const result = await db.query(
    `SELECT id, seat_row, seat_number, status
     FROM seats
     WHERE auditorium_id = $1
     ORDER BY seat_row, seat_number`,
    [auditoriumId]
  );
  return result.rows;
}

module.exports = {
  createSeats,
  getSeatsByAuditorium
};
