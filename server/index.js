const express = require('express');
const path = require('path');
const app = express();


// init Midlleware
app.use(express.json({ extended: false }));

// Define Routes

///////////////////////////////////////////////////////////////////////

// Serve static assests in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
