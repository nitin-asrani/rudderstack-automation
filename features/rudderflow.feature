Feature: RudderStack flow automation

  Background:
    Given I have valid credentials and environment configuration

  Scenario: Send event and verify delivery counts
    When I log in and navigate to connections
    Then I capture the dataPlane URL and write key
    When I send an event via HTTP API
    Then I open the webhook destination events tab
    And I verify delivered events count increased
