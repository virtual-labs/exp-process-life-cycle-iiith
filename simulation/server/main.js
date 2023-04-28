const express = require('express');
const cors = require('cors');
const mongo = require('mongodb')

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://aarushj09:aarushj09@cluster0.husrwrj.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb://localhost:27017";
let db = null;

// Connect to database
mongo.MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(client => {
        db = client.db('os_db');
        console.log('Connected to database.');
    })
    .catch(error => console.error(error));

app.put('/', async (req, res) => {
    // Check if experiment with ID 1 exists and if not, then create it
    const experiments = db.collection('experiments');
    experiments.findOne({ experiment_id: 1 })
        .then(experiment => {
            if (!experiment) {
                experiments.insertOne({
                    experiment_id: 1,
                    events: [],
                })
                    .then(() => {
                        res.send({
                            message: 'Experiment created.',
                        });
                    })
            } else {
                res.send({
                    message: 'Experiment already exists.',
                });
            }
        });
});

app.post('/moves', (req, res) => {
    const experiments = db.collection('experiments');
    experiments.findOne({ experiment_id: 1 })
        .then(experiment => {
            experiment.events.push({
                objType: 'move',
                ...req.body,
            });
            experiments.updateOne({ experiment_id: 1 }, { $set: { events: experiment.events } })
                .then(() => {
                    res.send({
                        message: 'Move added to database.',
                    });
                })
        })
});

app.post('/events', (req, res) => {
    const experiments = db.collection('experiments');
    experiments.findOne({ experiment_id: 1 })
        .then(experiment => {
            experiment.events.push({
                objType: 'event',
                ...req.body,
            });
            experiments.updateOne({ experiment_id: 1 }, { $set: { events: experiment.events } })
                .then(() => {
                    res.send({
                        message: 'Event added to database.',
                    });
                })
        })
});

app.post('/processes', (req, res) => {
    const experiments = db.collection('experiments');
    experiments.findOne({ experiment_id: 1 })
        .then(experiment => {
            experiment.events.push({
                objType: 'process creation',
                ...req.body,
            });
            experiments.updateOne({ experiment_id: 1 }, { $set: { events: experiment.events } })
                .then(() => {
                    res.send({
                        message: 'Process added to database.',
                    });
                })
        })
});

app.get('/terminations', (req, res) => {
    const experiments = db.collection('experiments');
    experiments.findOne({ experiment_id: 1 })
        .then(experiment => {
            experiment.events.push({
                objType: 'termination',
                ...req.body,
            });
            experiments.updateOne({ experiment_id: 1 }, { $set: { events: experiment.events } })
                .then(() => {
                    res.send({
                        message: 'Termination added to database.',
                    });
                })
        })
});

app.get('/resets', (req, res) => {
    const experiments = db.collection('experiments');
    experiments.findOne({ experiment_id: 1 })
        .then(experiment => {
            experiment.events.push({
                objType: 'reset',
                ...req.body,
            });
            experiments.updateOne({ experiment_id: 1 }, { $set: { events: experiment.events } })
                .then(() => {
                    res.send({
                        message: 'Reset added to database.',
                    });
                })
        })
});

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});