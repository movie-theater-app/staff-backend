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
        seat_type: 'normal', // initially normal seat unless wanted to modify as disabled seat
        status: 'available' // initially available
      });
    }
  }

  try {
    // loop through each seat in the array to insert it into the database
    for (const seat of seats) {
      await db.query(
        `INSERT INTO seats (auditorium_id, seat_row, seat_number, seat_type, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [auditoriumId, seat.seat_row, seat.seat_number, seat.seat_type, seat.status]
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
    `SELECT id, seat_row AS row, seat_number AS number, seat_type, status
     FROM seats
     WHERE auditorium_id = $1
     ORDER BY seat_row, seat_number`,
    [auditoriumId]
  );
  return result.rows;
}
// update seat status by seat id
async function updateSeatStatus(seatId, status) {
  const result = await db.query(
    `UPDATE seats SET status = $1 WHERE id = $2 RETURNING *`,
    [status, seatId]
  );
  return result.rows[0];
}
// update seat type
async function updateSeatType(seatId, seatType) {
  const allowedTypes = ['normal', 'disabled'];

  if (!allowedTypes.includes(seatType)) {
    throw new Error('Invalid seat type');
  }

  const result = await db.query(
    `UPDATE seats SET seat_type=$1 WHERE id=$2 RETURNING *`,
    [seatType, seatId]
  );

  return result.rows[0];
}

// reserve selected seats for a given auditorium
async function reserveSeats(auditoriumId, selectedSeats) {
  if (!selectedSeats || selectedSeats.length === 0) {
    return { success: false, message: 'No seats selected' };
  }

  try {
    const values = [];
    const placeholders = selectedSeats
      .map((seat, index) => {
        values.push(seat.row, seat.number);
        return `($${2 * index + 2}, $${2 * index + 3})`;
      })
      .join(', ');

    const reservedQuery = `
      SELECT seat_row, seat_number
      FROM seats
      WHERE auditorium_id = $1 AND status = 'reserved'
        AND (seat_row, seat_number) IN (${placeholders})
    `;

    const reserved = await db.query(reservedQuery, [auditoriumId, ...values]);

    if (reserved.rows.length > 0) {
      return { success: false, alreadyReserved: reserved.rows };
    }

    for (const seat of selectedSeats) {
      await db.query(
        `UPDATE seats SET status = 'reserved'
         WHERE auditorium_id = $1 AND seat_row = $2 AND seat_number = $3`,
        [auditoriumId, seat.row, seat.number]
      );
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createSeats,
  getSeatsByAuditorium,
  updateSeatStatus,
  updateSeatType,
  reserveSeats
};
