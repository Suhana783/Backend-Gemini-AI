// server.js

const express = require('express');
const app = express();

const path = require('path');

// Serve static files from the 'public' directory (where React build will go)
app.use(express.static(path.join(__dirname, 'public')));

// Define a basic GET route for the homepage (/)
app.get('/', (req, res) => {
    res.send('Hello from the Express Backend! Server is functional.');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Backend Express server initialized successfully! 🚀');
});