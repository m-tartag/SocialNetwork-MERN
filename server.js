const express = require('express');
const chalk = require('chalk');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

app.get('/', (req, res) => {
  res.send('API Running');
});

// Define Routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(chalk.yellow.inverse(`Server Connected [Port: ${PORT}])`))
);
