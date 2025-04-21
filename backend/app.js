const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js');

// Initialize Express app
const app = express();
const port = 3000;
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(express.json());

// Use the user routes
//app.use('/api', userRoutes);

// Use the todo routes
app.use(routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
