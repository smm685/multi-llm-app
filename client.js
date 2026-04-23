async function submitPrompt() {
    const prompt = document.getElementById('promptInput').value;
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = '';

    // Validate prompt
    if (!prompt || prompt.trim() === '') {
        errorMessage.innerText = 'Please enter a prompt.';
        return;
    }

    // Get selected models
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const models = Array.from(checkboxes).map(cb => cb.value);

    // Validate models
    if (models.length === 0) {
        errorMessage.innerText = 'Please select at least one LLM.';
        return;
    }

    // Show loading state
    const button = document.querySelector('button');
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
            button.innerText = 'Submit';
            button.disabled = false;
            return;
        }

        // Save results to localStorage and redirect
        localStorage.setItem('llmResults', JSON.stringify(data.responses));
        localStorage.setItem('llmPrompt', prompt);
        window.location.href = 'results.html';

    } catch (err) {
        errorMessage.innerText = 'Something went wrong. Please try again.';
        button.innerText = 'Submit';
        button.disabled = false;
    }
}

// Character counter
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('promptInput');
    const counter = document.getElementById('charCount');
    if (input && counter) {
        input.addEventListener('input', () => {
            counter.innerText = `${input.value.length} / 1000 characters`;
        });
    }
});