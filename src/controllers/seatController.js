const seatModel = require('../models/seatModel');

// Kun staff luo uuden auditorion
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

// Hae auditorion paikat
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

module.exports = {
  createSeatsForAuditorium,
  getSeatsByAuditorium
};
