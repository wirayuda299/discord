### Requrirement

#### User

- username
- email
- image
- followedServer[] -> serverId
- Server[] -> serverId
- Message[] -> messageId
- createdAt -> Date
- updateAt -> Date

### Server

- id -> String
- name -> String
- logo -> String
- desc -> String
- members -> String[] -> userId
- author -> String -> userId
- messages -> Message[] -> messageId
- createdAt -> Date
- updateAt -> Date

### Messages

- id -> String
- members -> String[] -> userId
- chat -> Chat[] -> ChatId
- createdAt -> Date
- updateAt -> Date

### Chat

- message -> String
- media:
  - audio -> String -> audioUrl
  - image -> String -> imageUrl
- from -> String
- to -> String
- is_read -> Boolean
- createdAt -> Date
- updateAt -> Date
