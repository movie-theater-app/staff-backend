const seatModel = require('../models/seatModel');

// when staff creates a new auditorium
async function createSeatsForAuditorium(req, res) {
  const { auditoriumId, seatCount } = req.body;

  if (!auditoriumId || !seatCount) {
    return res.status(400).json({ error: "auditoriumId and seatCount required" });
  }

  try {
    const count = await seatModel.createSeats(auditoriumId, seatCount);
    res.json({ success: true, createdSeats: count });
  } catch (error) {
    console.error("Error creating seats:", error);
    res.status(500).json({ error: "Failed to create seats" });
  }
}

// get auditorium seats
async function getSeatsByAuditorium(req, res) {
  const { auditoriumId } = req.params;

  try {
    const seats = await seatModel.getSeatsByAuditorium(auditoriumId);
    res.json(seats);
  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ error: "Failed to fetch seats" });
  }
}

// update seat status
async function updateSeatStatus (req, res) {
    try {
        const { seatId} = req.params;
        const { status } = req.body;
        // validate status value
        if (!['available','reserved'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const updated = await seatModel.updateSeatStatus(seatId, status);
        if (!updated) {
          return res.status(404).json({ error: 'Seat not found' });
        }
          res.json(updated);
    } catch (err) {
          console.error(err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to update seat status' });
          }
      }
};

// update seat type
async function updateSeatType(req, res) {
  try {
    const { id } = req.params;
    const { seat_type } = req.body;
    const allowedTypes = ['normal', 'disabled'];
    if (!allowedTypes.includes(seat_type)) {
      return res.status(400).json({ error: 'Invalid seat type' });
    }
    const updated = await seatModel.updateSeatType(id, seat_type);

    if (!updated) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// reserve seats
async function reserveSeats(req, res) {
  const { auditoriumId, seats } = req.body;
  try {
    const result = await seatModel.reserveSeats(auditoriumId, seats);
    res.json(result);
  } catch (error) {
    console.error("Error reserving seats:", error);
    res.status(500).json({ error: "Failed to reserve seats" });
  }
}

module.exports = {
  createSeatsForAuditorium,
  getSeatsByAuditorium,
  updateSeatStatus,
  updateSeatType,
  reserveSeats,
};

