const VALID_MODELS = ['phi3', 'mistral', 'gemma3'];

function validatePromptInput(prompt) {
    if (!prompt || prompt.trim() === '') {
        return { valid: false, message: 'Please enter a prompt.' };
    }
    if (prompt.length > 1000) {
        return { valid: false, message: 'Prompt must be under 1000 characters.' };
    }
    return { valid: true, message: '' };
}

function validateLLMSelection(models) {
    if (!models || models.length === 0) {
        return { valid: false, message: 'Please select at least one LLM.' };
    }
    for (const model of models) {
        if (!VALID_MODELS.includes(model)) {
            return { valid: false, message: 'Invalid LLM selected.' };
        }
    }
    return { valid: true, message: '' };
}

module.exports = { validatePromptInput, validateLLMSelection };