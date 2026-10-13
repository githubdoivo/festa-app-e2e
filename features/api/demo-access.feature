@api
Feature: Shared demo logins
  The public demo offers two shared keys, so anyone can try the app
  without an account. Each key must log in with exactly its own rights.

  Background:
    Given the demo is running

  @smoke
  Scenario: The demo offers a guest key and an admin key
    When I ask the demo for its shared keys
    Then I get a "guest" key and an "admin" key

  Scenario Outline: The <role> key logs in with the right permissions
    When I log in through the API with the <role> key
    Then the login succeeds
    And the account is an admin: <admin>
    And the account is the owner: no

    Examples:
      | role  | admin |
      | guest | no    |
      | admin | yes   |

  Scenario: Keys are not case-sensitive
    When I log in through the API with the guest key in capitals
    Then the login succeeds

  Scenario: An unknown key is rejected
    When I log in through the API with the key "not-a-real-key"
    Then the API answers 401 with error "err_token_invalid"

  Scenario: Protected endpoints need a key
    When I call "GET /api/me" without a key
    Then the API answers 401 with error "err_token_missing"
