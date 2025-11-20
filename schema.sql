-- NorthStar Movie Theatre database schema for PostgreSQL

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role BOOLEAN NOT NULL,
    email VARCHAR UNIQUE NOT NULL
);

-- THEME
CREATE TABLE IF NOT EXISTS theme (
    id SERIAL PRIMARY KEY,
    logo VARCHAR,
    color_scheme VARCHAR
);

-- THEATERS
CREATE TABLE IF NOT EXISTS theaters (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    address VARCHAR UNIQUE NOT NULL,
    contact_information TEXT UNIQUE NOT NULL
);

-- AUDITORIUMS
CREATE TABLE IF NOT EXISTS auditoriums (
    id SERIAL PRIMARY KEY,
    theater_id INT NOT NULL REFERENCES theaters(id),
    name VARCHAR NOT NULL,
    seat_count INT NOT NULL,
    UNIQUE(theater_id, name)
);

-- SEATS
CREATE TABLE IF NOT EXISTS seats (
    id SERIAL PRIMARY KEY,
    auditorium_id INT NOT NULL REFERENCES auditoriums(id),
    seat_number INT NOT NULL,
    seat_type VARCHAR,
    UNIQUE(auditorium_id, seat_number)
);

-- MOVIES
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR UNIQUE NOT NULL,
    trailer_url VARCHAR NOT NULL,
    genre VARCHAR NOT NULL,
    duration_minutes INT NOT NULL,
    description TEXT NOT NULL,
    poster_url VARCHAR UNIQUE NOT NULL,
    age_rating INT
);

-- SCHEDULES
CREATE TABLE IF NOT EXISTS schedules (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL REFERENCES movies(id),
    auditorium_id INT NOT NULL REFERENCES auditoriums(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    days TEXT NOT NULL,
    UNIQUE(auditorium_id, start_time)
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    schedule_id INT NOT NULL REFERENCES schedules(id),
    movie_id INT NOT NULL REFERENCES movies(id),
    total_amount DECIMAL NOT NULL,
    payment_status VARCHAR NOT NULL,
    reserved_until TIMESTAMP NOT NULL
);

-- BOOKING_SEATS
CREATE TABLE IF NOT EXISTS booking_seats (
    booking_id INT NOT NULL REFERENCES bookings(id),
    seat_id INT NOT NULL REFERENCES seats(id),
    UNIQUE(booking_id, seat_id)
);

-- TICKETS
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id),
    price DECIMAL NOT NULL,
    child_discount BOOLEAN DEFAULT FALSE NOT NULL,
    qr_code VARCHAR UNIQUE NOT NULL,
    barcode_number VARCHAR UNIQUE NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE NOT NULL
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id),
    payment_processor VARCHAR NOT NULL,
    payment_reference VARCHAR UNIQUE NOT NULL,
    paid_at TIMESTAMP NOT NULL,
    amount DECIMAL NOT NULL,
    status VARCHAR NOT NULL
);

-- STATISTICS
CREATE TABLE IF NOT EXISTS statistics (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL REFERENCES movies(id),
    theater_id INT NOT NULL REFERENCES theaters(id),
    auditorium_id INT NOT NULL REFERENCES auditoriums(id),
    tickets_sold INT NOT NULL,
    total_revenue DECIMAL NOT NULL,
    report_month INT NOT NULL,
    report_year INT NOT NULL,
    UNIQUE(movie_id, theater_id, auditorium_id, report_month, report_year)
);

-- MOVIE_INFORMATION
CREATE TABLE IF NOT EXISTS movie_information (
    id SERIAL PRIMARY KEY,
    api_movie_id VARCHAR UNIQUE NOT NULL,
    movie_id INT UNIQUE NOT NULL REFERENCES movies(id),
    review TEXT,
    data TEXT
);
