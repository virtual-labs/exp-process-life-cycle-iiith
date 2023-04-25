const express = require('express');
const cors = require('cors');
const mongo = require('mongodb')

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://aarushj09:aarushj09@cluster0.husrwrj.mongodb.net/?retryWrites=true&w=majority";
let db = null;

// Connect to database
mongo.MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(client => {
        db = client.db('os_db');
        console.log('Connected to database.');
    })
    .catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send({
        message: 'Hello World!',
    });
});

app.post('/moves', (req, res) => {
    const moves = db.collection('moves');
    moves.insertOne(req.body);
    res.send({
        message: 'Move added to database.',
    });
});

app.post('/events', (req, res) => {
    const events = db.collection('events');
    events.insertOne(req.body);
    res.send({
        message: 'Event added to database.',
    });
});

app.post('/processes', (req, res) => {
    const processes = db.collection('processes');
    processes.insertOne(req.body);
    res.send({
        message: 'Process added to database.',
    });
});

app.get('/terminations', (req, res) => {
    const terminations = db.collection('terminations');
    terminations.insertOne(req.body);
    res.send({
        message: 'Termination added to database.',
    });
});

app.get('/resets', (req, res) => {
    const resets = db.collection('resets');
    resets.insertOne(req.body);
    res.send({
        message: 'Reset added to database.',
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});