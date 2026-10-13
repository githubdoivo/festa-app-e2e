@ui
Feature: Using the app as a guest

  Background:
    Given I am logged in to the demo as the guest

  @smoke
  Scenario: The Wall shows the hosts' posts
    Then the Wall shows an announcement, a poll and a list of links

  Scenario: The Location link opens Google Maps for Braga
    Then the "Location" link points to Google Maps for "Braga"

  Scenario: The app switches between English and Portuguese
    Then the Wall heading reads "what's going on here"
    When I switch the language
    Then the Wall heading reads "o que se passa aqui"
    When I switch the language
    Then the Wall heading reads "what's going on here"

  Scenario Outline: Each Snatch night has its own look
    When I open the "outfit" tab
    And I pick the "<night>" night
    Then the page takes on the "<night>" look

    Examples:
      | night     |
      | furnished |
      | swamp     |
