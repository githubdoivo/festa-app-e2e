@ui
Feature: Logging in to the demo
  A visitor should get from the login screen into the app in one tap,
  with the rights of the key they picked.

  Background:
    Given I open the demo

  @smoke
  Scenario: The login screen offers both demo keys
    Then I see a demo key for "guest" and for "admin"

  Scenario Outline: One tap logs in as the <role>
    When I tap the <role> demo key
    And I skip the welcome tour if it shows
    Then I am in the app on the Wall

    Examples:
      | role  |
      | guest |
      | admin |

  Scenario: The admin key opens the admin panel
    When I tap the admin demo key
    And I skip the welcome tour if it shows
    And I open the settings
    Then I can run the Snatch voting

  Scenario: The guest key does not
    When I tap the guest demo key
    And I skip the welcome tour if it shows
    And I open the settings
    Then the admin tabs are hidden
