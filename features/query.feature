Feature: LLM Compare Chat
  As a user
  I want to submit a prompt to multiple LLMs at once
  So that I can compare their responses side by side

  Scenario: Landing page loads correctly
    Given I navigate to the home page
    Then the page title should contain "LLM Compare"
    And I should see a "Start" button

  Scenario: Successful prompt submission to multiple LLMs
    Given I am on the chat page
    When I type "What is the capital of France?" in the prompt box
    And I click the "Send" button
    Then I should see at least 2 response columns on the same page

  Scenario: Submit fails when prompt is empty
    Given I am on the chat page
    When I leave the prompt box empty
    And I click the "Send" button
    Then I should see an error message "Please enter a prompt."

  Scenario: Submit fails when no LLM is selected
    Given I am on the chat page
    And I have deselected all models
    When I type "Hello" in the prompt box
    And I click the "Send" button
    Then I should see an error message "Please select at least one LLM."

  Scenario: Models are available in the selector
    Given I am on the chat page
    Then I should see phi3, mistral, and gemma3 as options

  Scenario: At least one model is selected by default
    Given I am on the chat page
    Then at least one model should be selected by default