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

```javascript
[
    {
        prompt: "What is the capital of France?",
        responses: [
            { model: "phi3", text: "response text here" },
            { model: "mistral", text: "response text here" },
            { model: "gemma3", text: "response text here" }
        ],
        createdAt: "2026-04-23T20:00:00.000Z"
    }
]
```

## Installation

1. Clone the repository:
git clone https://github.com/smm685/multi-llm-app.gitcd multi-llm-app

2. Install dependencies:
npm install

3. Install Ollama from https://ollama.com

4. Pull the required models:

ollama pull phi3
ollama pull mistral
ollama pull gemma3

## Running the App

1. Start Ollama:
ollama serve

2. In a new terminal start the server:
node server.js

3. Open browser and go to: http://localhost:8080

##  Unit Tests

1. Run: 
npm run test:unit
2. Results 


##  Puppeteer Tests
1. Run: npm run test:e2e
2. A browser window will open and automatically click through the app
3. Results 


##  Cucumber Acceptance Tests

1. Run: npm run test:cucumber
2. Results 


