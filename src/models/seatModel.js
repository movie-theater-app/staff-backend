const db = require('../db/db');

// Luo paikat auditorioon tietokantaan
async function createSeats(auditoriumId, seatCount, columns = 15) {
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const rows = Math.ceil(seatCount / columns);
  const seats = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 1; column <= columns; column++) {
      const seatNumber = row * columns + column;
      if (seatNumber > seatCount) break;

      seats.push({
        seat_row: rowLabels[row],
        seat_number: column,
        status: 'available'
      });
    }
  }

  try {
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

// Hae kaikki paikat tietystä auditoriosta
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
