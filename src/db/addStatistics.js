const db = require('./db');

async function addStatistics() {
    try {
        const checkQuery = 'SELECT COUNT(*) as count FROM statistics;';
        const result = await db.query(checkQuery);
        
        if (result.rows[0].count > 0) {
            console.log('Statistics data already exists. Skipping.');
            return;
        }

        const statisticsData = [
            { movie_id: 1, theater_id: 1, auditorium_id: 1, tickets_sold: 145, total_revenue: 217500, report_month: 10, report_year: 2025 },
            { movie_id: 1, theater_id: 1, auditorium_id: 2, tickets_sold: 132, total_revenue: 198000, report_month: 10, report_year: 2025 },
            { movie_id: 1, theater_id: 1, auditorium_id: 3, tickets_sold: 128, total_revenue: 192000, report_month: 10, report_year: 2025 },
            { movie_id: 2, theater_id: 2, auditorium_id: 4, tickets_sold: 156, total_revenue: 234000, report_month: 10, report_year: 2025 },
            { movie_id: 2, theater_id: 2, auditorium_id: 5, tickets_sold: 141, total_revenue: 211500, report_month: 10, report_year: 2025 },
            { movie_id: 2, theater_id: 2, auditorium_id: 6, tickets_sold: 149, total_revenue: 223500, report_month: 10, report_year: 2025 },
            { movie_id: 3, theater_id: 2, auditorium_id: 7, tickets_sold: 178, total_revenue: 267000, report_month: 10, report_year: 2025 },
            { movie_id: 3, theater_id: 3, auditorium_id: 10, tickets_sold: 165, total_revenue: 247500, report_month: 10, report_year: 2025 },
            { movie_id: 3, theater_id: 3, auditorium_id: 11, tickets_sold: 187, total_revenue: 280500, report_month: 10, report_year: 2025 },
            { movie_id: 1, theater_id: 1, auditorium_id: 1, tickets_sold: 162, total_revenue: 243000, report_month: 11, report_year: 2025 },
            { movie_id: 1, theater_id: 1, auditorium_id: 2, tickets_sold: 149, total_revenue: 223500, report_month: 11, report_year: 2025 },
            { movie_id: 1, theater_id: 2, auditorium_id: 4, tickets_sold: 155, total_revenue: 232500, report_month: 11, report_year: 2025 },
            { movie_id: 2, theater_id: 1, auditorium_id: 3, tickets_sold: 171, total_revenue: 256500, report_month: 11, report_year: 2025 },
            { movie_id: 2, theater_id: 2, auditorium_id: 5, tickets_sold: 189, total_revenue: 283500, report_month: 11, report_year: 2025 },
            { movie_id: 2, theater_id: 2, auditorium_id: 6, tickets_sold: 142, total_revenue: 213000, report_month: 11, report_year: 2025 },
            { movie_id: 3, theater_id: 2, auditorium_id: 7, tickets_sold: 176, total_revenue: 264000, report_month: 11, report_year: 2025 },
            { movie_id: 3, theater_id: 3, auditorium_id: 10, tickets_sold: 163, total_revenue: 244500, report_month: 11, report_year: 2025 },
            { movie_id: 3, theater_id: 3, auditorium_id: 11, tickets_sold: 201, total_revenue: 301500, report_month: 11, report_year: 2025 },
            { movie_id: 1, theater_id: 1, auditorium_id: 1, tickets_sold: 138, total_revenue: 207000, report_month: 9, report_year: 2025 },
            { movie_id: 1, theater_id: 1, auditorium_id: 2, tickets_sold: 147, total_revenue: 220500, report_month: 9, report_year: 2025 },
            { movie_id: 1, theater_id: 2, auditorium_id: 6, tickets_sold: 151, total_revenue: 226500, report_month: 9, report_year: 2025 },
            { movie_id: 2, theater_id: 1, auditorium_id: 3, tickets_sold: 159, total_revenue: 238500, report_month: 9, report_year: 2025 },
            { movie_id: 2, theater_id: 2, auditorium_id: 4, tickets_sold: 168, total_revenue: 252000, report_month: 9, report_year: 2025 },
            { movie_id: 2, theater_id: 2, auditorium_id: 5, tickets_sold: 174, total_revenue: 261000, report_month: 9, report_year: 2025 },
            { movie_id: 3, theater_id: 2, auditorium_id: 7, tickets_sold: 144, total_revenue: 216000, report_month: 9, report_year: 2025 },
            { movie_id: 3, theater_id: 3, auditorium_id: 10, tickets_sold: 166, total_revenue: 249000, report_month: 9, report_year: 2025 },
            { movie_id: 3, theater_id: 3, auditorium_id: 11, tickets_sold: 179, total_revenue: 268500, report_month: 9, report_year: 2025 }
        ];

        const insertQuery = `
            INSERT INTO statistics (movie_id, theater_id, auditorium_id, tickets_sold, total_revenue, report_month, report_year)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;

        for (const stat of statisticsData) {
            await db.query(insertQuery, [
                stat.movie_id,
                stat.theater_id,
                stat.auditorium_id,
                stat.tickets_sold,
                stat.total_revenue,
                stat.report_month,
                stat.report_year
            ]);
        }

        console.log(`Successfully added statistics records.`);
    } catch (error) {
        console.error('Error adding statistics:', error.message);
        throw error;
    }
}

module.exports = { addStatistics };
