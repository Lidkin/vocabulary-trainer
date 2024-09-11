const express = require('express');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const cors = require('cors');
const port = process.env.PORT || 3001;
const app = express();
const words = require('./routes/getWords');

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow only this origin
    methods: ['GET', 'POST', 'PUT'], // Specify allowed methods
}));

const db = async () => {
  try {
    await sqlite.open({ filename: './vocabulary.db', driver: sqlite3.Database });
  } catch (err) {
    console.error('Database error:', err);
  }
};



// let db = new sqlite3.Database('./vocabulary.db', (err) => {
//     if (err) {
//         console.error("Could not connect to database", err);
//     } else {
//         console.log("Connected to SQLite database");
//     }
// });
words.getWords('/words', app, db);

app.get('/words', (req, res) => {
    db.all('SELECT * FROM words', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            words: rows
        });
    });
});

app.put('/words/:id=', async (req, res) => {
  const wordId = req.params['id='];
  const { mistakes } = req.body;

  db.run('UPDATE words SET mistakes = ? WHERE id = ?', [wordId, mistakes], (err, result) => {
    console.log("result:", result);
    if (result.changes == 0) {
      return res.status(404).json({ message: 'Word not found.' });
    }
    if (err) res.status(500).json({ message: 'Internal server error.' });
    res.status(200).json({message: `mistakes count in word ${result[english]} was changed`});
  });
});

app.post('/words', (req, res) => {  
  const { english, russian, pronunciation, mistakes } = req.body;

  if (!english || !russian || !pronunciation) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let existingWord;

  db.get('SELECT * FROM words WHERE english = ?', [english], (err, rows) => { 
    existingWord = rows.english == english ? true : false;
  });

  console.log("existingWord result", existingWord)
  console.log("english", english);
   const query = 'INSERT INTO words (english, russian, pronunciation, mistakes) VALUES (?, ?, ?, ?)';
  if (existingWord == true) return res.status(400).json({ message: 'Word already exists in the vocabulary.' });

  db.run(query, [english, russian, pronunciation, mistakes], (err) => {
    if (err) {
      console.error('Error inserting into database:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ id: this.lastID });
    refreshData();
  });
});

const refreshData = () => {
  db.all('SELECT * FROM words', [], (err) => { 
    if (err) { 
      throw err;
    }
  })
}

const closeDb = () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
};

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', () => {
  console.log('Closing server...');
  closeDb();
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});