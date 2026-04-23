async function submitPrompt() {
    const prompt = document.getElementById('promptInput').value;
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = '';

    if (!prompt || prompt.trim() === '') {
        errorMessage.innerText = 'Please enter a prompt.';
        return;
    }

    const select = document.getElementById('modelSelect');
    const models = Array.from(select.options).map(o => o.value);

    if (models.length === 0) {
        errorMessage.innerText = 'Please select at least one LLM.';
        return;
    }

    const container = document.getElementById('responsesContainer');
    const promptDisplay = document.getElementById('promptDisplay');
    container.innerHTML = '<p class="loading">Loading responses...</p>';
    promptDisplay.innerText = 'Prompt: ' + prompt;

    const button = document.querySelector('.query-input-row .btn-primary');
    button.innerText = 'Loading...';
    button.disabled = true;

    try {
        const response = await fetch('/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, models })
        });

        const data = await response.json();

        if (data.error) {
            errorMessage.innerText = data.error;
            container.innerHTML = '';
            button.innerText = 'Send';
            button.disabled = false;
            return;
        }

        container.innerHTML = '';
        data.responses.forEach(r => {
            const col = document.createElement('div');
            col.className = 'response-column';
            col.innerHTML = `<h3>${r.model}</h3><p>${r.text}</p>`;
            container.appendChild(col);
        });

        addToHistory(prompt);
        document.getElementById('promptInput').value = '';
        button.innerText = 'Send';
        button.disabled = false;

    } catch (err) {
        errorMessage.innerText = 'Something went wrong. Please try again.';
        container.innerHTML = '';
        button.innerText = 'Send';
        button.disabled = false;
    }
}

function clearResults() {
    document.getElementById('responsesContainer').innerHTML = '<p style="color:#aaa;">Your responses will appear here.</p>';
    document.getElementById('promptDisplay').innerText = '';
    document.getElementById('promptInput').value = '';
    document.getElementById('errorMessage').innerText = '';
}

function addToHistory(prompt) {
    const list = document.getElementById('historyList');
    const existing = list.querySelector('p');
    if (existing) existing.remove();

    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerText = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt;
    item.onclick = () => {
        document.getElementById('promptInput').value = prompt;
    };
    list.prepend(item);
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('promptInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitPrompt();
            }
        });
    }
});