# LLM Compare

A web app that sends a single prompt to multiple AI models at the same time and displays responses side by side.

## Routing Table

```javascript
app.post('/api/query', queryHandler);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
```

## Database Design

Chat history is stored in the browser using localStorage. No server-side database is used.

Key: llmResults
Value:
```javascript
[
    { model: "phi3", text: "response text here" },
    { model: "mistral", text: "response text here" },
    { model: "gemma3", text: "response text here" }
]
```

Key: llmPrompt  
Value: "What is the capital of France?"
## Installation

1. Clone the repository:
git clone https://github.com/smm685/multi-llm-app.gitcd multi-llm-app

2. Install dependencies:

3. Install Ollama from https://ollama.com

4. Pull the required models:
ollama pull phi3
ollama pull mistral
ollama pull gemma3

## Running the App

1. Start Ollama:
ollama run phi3

2. In a new terminal start the server:
node server.js

3. Open browser and go to:
http://localhost:8080

## Running Unit Tests
npm run test:unit

## Running Puppeteer Tests
npm run test:e2e

## Running Cucumber Acceptance Tests
1. Make sure the server is running: `node server.js`
2. Run: `npm run test:cucumber`
3. Results will show passed and failed scenarios in the terminal
