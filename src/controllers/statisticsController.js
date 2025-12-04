const Statistics = require('../models/statisticsModel');

async function getAllStatistics(req, res) {
    try {
        const statistics = await Statistics.getAllStatistics();
        res.status(200).json(statistics);
    } catch (error) {
        console.error("Error getting statistics: ", error.message);
        res.status(500).json({ error: "Failed to get statistics" });
    }
}

async function getStatisticsByPeriod(req, res) {
    const { month, year } = req.query;
    
    if (!month || !year) {
        return res.status(400).json({ error: "Month and year are required" });
    }
    
    try {
        const statistics = await Statistics.getStatisticsByPeriod(parseInt(month), parseInt(year));
        res.status(200).json(statistics);
    } catch (error) {
        console.error(`Error getting statistics for ${month}/${year}: `, error.message);
        res.status(500).json({ error: "Failed to get statistics for period" });
    }
}

module.exports = {
    getAllStatistics,
    getStatisticsByPeriod
};
