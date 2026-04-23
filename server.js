require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/chat';
const MONGO_URI = process.env.MONGO_URI;

let db;
let queries;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

async function queryOllama(model, prompt) {
    try {
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                stream: false
            })
        });
        const data = await response.json();
        return { model, text: data.message.content };
    } catch (err) {
        return { model, text: 'Response unavailable' };
    }
}

async function queryHandler(req, res) {
    const { prompt, models } = req.body;
    if (!prompt || prompt.trim() === '') {
        return res.status(400).json({ error: 'Please enter a prompt.' });
    }
    if (!models || models.length === 0) {
        return res.status(400).json({ error: 'Please select at least one LLM.' });
    }
    try {
        const responses = await Promise.all(models.map(m => queryOllama(m, prompt)));
        if (queries) {
            await queries.insertOne({
                prompt,
                models,
                responses,
                createdAt: new Date()
            });
        }
        res.json({ responses });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

async function historyHandler(req, res) {
    try {
        const history = await queries.find({}).sort({ createdAt: -1 }).limit(50).toArray();
        res.json({ history });
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch history' });
    }
}

app.post('/api/query', queryHandler);
app.get('/api/history', historyHandler);

async function startServer() {
    try {
        if (MONGO_URI) {
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            console.log('Connected to MongoDB');
            db = client.db('dbs');
            queries = db.collection('queries');
        }
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();