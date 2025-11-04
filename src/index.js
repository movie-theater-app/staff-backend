const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const movieRoutes = require('./routes/movieRoutes');

app.use(express.json());

app.use('/api/movie', movieRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});