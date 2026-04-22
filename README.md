## Routing Table

app.post('/api/query', queryHandler);
app.get('/api/history', historyHandler);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

## Database Design

MongoDB database: dbs
Collection: queries

Each document:
{
    _id: ObjectId('...'),
    prompt: "What is the capital of France?",
    models: ["phi3", "mistral", "gemma3"],
    responses: [
        { model: "phi3", text: "Paris." },
        { model: "mistral", text: "The capital of France is Paris." },
        { model: "gemma3", text: "Paris is the capital of France." }
    ],
    createdAt: 2026-04-23T00:00:00.000Z
}