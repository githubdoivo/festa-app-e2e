@api
Feature: Demo guard rails
  The demo is open to strangers. Anything that could lock the next visitor
  out, publish something a stranger could abuse, or wipe the demo for
  everyone is refused - and refusing it must leave the demo untouched.

  Background:
    Given the demo is running

  Scenario Outline: <action> is refused
    When the <role> calls "<method> <path>" with body: <body>
    Then the API answers 403 with error "err_demo_disabled"

    Examples:
      | action                        | role  | method | path                                  | body                                                                         |
      | Changing the shared key       | guest | POST   | /api/me/change-token                  | {"currentToken": "x", "newToken": "mine12345"}                               |
      | Posting in the anonymous chat | guest | POST   | /api/chat/messages                    | {"text": "hello"}                                                            |
      | Posting links on the Wall     | admin | POST   | /api/admin/plaza-posts                | {"type": "links", "text": "x", "links": [{"label": "x", "url": "https://example.com"}]} |
      | Wiping the Wall               | admin | POST   | /api/admin/plaza-posts/wipe           | {}                                                                           |
      | Wiping the consequences       | admin | POST   | /api/admin/consequences/wipe          | {}                                                                           |
      | Resetting a night completely  | admin | POST   | /api/admin/voting/furnished/reset-all | {}                                                                           |
      | Deleting an entry             | admin | DELETE | /api/admin/contestants/1              | {}                                                                           |
      | Changing the settings         | admin | PUT    | /api/admin/settings                   | {}                                                                           |

  Scenario: The shared key still works after someone tried to change it
    Given the guest tried to change the shared key
    When I log in through the API with the guest key
    Then the login succeeds
