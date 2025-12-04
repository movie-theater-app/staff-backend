const db = require('../db/db');

async function getAllStatistics() {
    const query = `
        SELECT 
            s.id,
            s.movie_id,
            m.title as movie_title,
            s.theater_id,
            t.name as theater_name,
            s.auditorium_id,
            a.name as auditorium_name,
            s.tickets_sold,
            s.total_revenue,
            s.report_month,
            s.report_year
        FROM statistics s
        LEFT JOIN movies m ON s.movie_id = m.id
        LEFT JOIN theaters t ON s.theater_id = t.id
        LEFT JOIN auditoriums a ON s.auditorium_id = a.id
        ORDER BY s.report_year DESC, s.report_month DESC, s.total_revenue DESC;
    `;
    
    const result = await db.query(query);
    return result.rows;
}

async function getStatisticsByPeriod(month, year) {
    const query = `
        SELECT 
            s.id,
            s.movie_id,
            m.title as movie_title,
            s.theater_id,
            t.name as theater_name,
            s.auditorium_id,
            a.name as auditorium_name,
            s.tickets_sold,
            s.total_revenue,
            s.report_month,
            s.report_year
        FROM statistics s
        LEFT JOIN movies m ON s.movie_id = m.id
        LEFT JOIN theaters t ON s.theater_id = t.id
        LEFT JOIN auditoriums a ON s.auditorium_id = a.id
        WHERE s.report_month = $1 AND s.report_year = $2
        ORDER BY s.total_revenue DESC;
    `;
    
    const result = await db.query(query, [month, year]);
    return result.rows;
}

module.exports = {
    getAllStatistics,
    getStatisticsByPeriod
};
