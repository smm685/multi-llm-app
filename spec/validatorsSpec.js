const { validatePromptInput, validateLLMSelection } = require('../lib/validators');

describe('validatePromptInput', () => {

    describe('empty prompt validation', () => {
        it('fails when prompt is empty string', () => {
            const result = validatePromptInput('');
            expect(result.valid).toBe(false);
            expect(result.message).toBe('Please enter a prompt.');
        });

        it('fails when prompt is only whitespace', () => {
            const result = validatePromptInput('   ');
            expect(result.valid).toBe(false);
        });

        it('fails when prompt is null', () => {
            const result = validatePromptInput(null);
            expect(result.valid).toBe(false);
        });
    });

    describe('prompt length validation', () => {
        it('fails when prompt exceeds 1000 characters', () => {
            const longPrompt = 'a'.repeat(1001);
            const result = validatePromptInput(longPrompt);
            expect(result.valid).toBe(false);
            expect(result.message).toBe('Prompt must be under 1000 characters.');
        });

        it('passes when prompt is exactly 1000 characters', () => {
            const result = validatePromptInput('a'.repeat(1000));
            expect(result.valid).toBe(true);
        });

        it('passes when prompt is a normal sentence', () => {
            const result = validatePromptInput('What is the capital of France?');
            expect(result.valid).toBe(true);
        });
    });

    it('returns valid:true for a normal prompt', () => {
        const result = validatePromptInput('Explain quantum computing.');
        expect(result.valid).toBe(true);
        expect(result.message).toBe('');
    });
});

describe('validateLLMSelection', () => {

    it('fails when no LLMs are selected', () => {
        const result = validateLLMSelection([]);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Please select at least one LLM.');
    });

    it('fails when selection is null', () => {
        const result = validateLLMSelection(null);
        expect(result.valid).toBe(false);
    });

    it('passes when one LLM is selected', () => {
        const result = validateLLMSelection(['phi3']);
        expect(result.valid).toBe(true);
        expect(result.message).toBe('');
    });

    it('passes when multiple LLMs are selected', () => {
        const result = validateLLMSelection(['phi3', 'mistral', 'gemma3']);
        expect(result.valid).toBe(true);
    });

    it('fails when selection contains invalid LLM names', () => {
        const result = validateLLMSelection(['fakemodel']);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Invalid LLM selected.');
    });
});