Feature: Multi-LLM Query
  As a user
  I want to submit a prompt to multiple LLMs at once
  So that I can compare their responses side by side

  Scenario: Landing page loads correctly
    Given I navigate to the home page
    Then the page title should contain "Multi-LLM"
    And I should see a "Get Started" button

  Scenario: Successful prompt submission to multiple LLMs
    Given I am on the query page
    And I have checked "phi3" and "mistral"
    When I type "What is the capital of France?" in the prompt box
    And I click the "Submit" button
    Then I should be taken to the results page
    And I should see at least 2 response columns

  Scenario: Submit fails when prompt is empty
    Given I am on the query page
    And I have checked "phi3"
    When I leave the prompt box empty
    And I click the "Submit" button
    Then I should see an error message "Please enter a prompt."

  Scenario: Submit fails when no LLM is selected
    Given I am on the query page
    And I have unchecked all LLMs
    When I type "Hello" in the prompt box
    And I click the "Submit" button
    Then I should see an error message "Please select at least one LLM."

  Scenario: User can select and deselect LLMs
    Given I am on the query page
    Then I should see checkboxes for "phi3", "mistral", and "gemma3"
    When I uncheck "mistral"
    And I check "gemma3"
    Then "gemma3" should be checked
    And "mistral" should be unchecked

  Scenario: At least one LLM is checked by default
    Given I am on the query page
    Then at least one LLM checkbox should be checked by default