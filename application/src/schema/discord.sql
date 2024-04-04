create extension if not exists "uuid-ossp";

create type channeltype as enum ('text', 'audio')
-- user 
create table if not exists users(
 id varchar(100) primary key, username varchar(255) unique not null, email varchar(255) unique not null, image varchar(255) not null, created_at timestamp with time zone default current_timestamp, updated_at timestamp with time zone default current_timestamp
);
---- one user will have many server
--- one to many
create table if not exists servers(
 id varchar(100) primary key default uuid_generate_v4(), name varchar(100) not null, logo varchar(255) not null, logo_asset_id varchar(255) not null, owner_id varchar(100), invite_code varchar(100) default uuid_generate_v4(), created_at timestamp with time zone default current_timestamp, updated_at timestamp with time zone default current_timestamp, constraint fk_owner_id foreign key (owner_id) references users(id) on
delete cascade on
update cascade
);
-- server will have many members
--many to many
create table if not exists members(
 id varchar(100) primary key default uuid_generate_v4(), server_id varchar(100) not null, user_id varchar(100) not null, unique (server_id, user_id), constraint fk_server_id foreign key (server_id) references servers(id) on
delete cascade, constraint fk_user_id foreign key (user_id) references users(id) on
delete cascade
 
);

create table roles (
 id varchar(100) primary key default uuid_generate_v4(), name VARCHAR(255) not null
);

create table permissions (
  id varchar(100) primary key default uuid_generate_v4(), name VARCHAR(255) not null
);

create table role_permissions (
    role_id varchar(100) references roles(id), permission_id varchar(100) references permissions(id), primary key (role_id, permission_id)
);

create table member_roles (
    member_id varchar(100) references members(id), role_id varchar(100) references roles(id), primary key (member_id, role_id)
);
--server will have many channels
create table if not exists channels(
 id varchar(100) primary key default uuid_generate_v4(), server_id varchar(100) not null, type channeltype, constraint fk_server_id foreign key (server_id) references servers(id) on
delete cascade
)

create table if not exists categories(
id varchar(100) primary key default uuid_generate_v4(),
name varchar(100) not null
)

create table if not exists channels_category( 
channel_id varchar(100) not null,
category_id varchar(100) not null, 
primary key(channel_id, category_id), 
constraint fk_channel_id foreign key (channel_id) references channels(id),
constraint fk_category_id foreign key (category_id) references categories(id)
	)
	
--channels
create table if not exists channels(
 id varchar(100) primary key default uuid_generate_v4(), 
 name varchar(100) not null, 
 created_at timestamp with time zone default current_timestamp, 
 updated_at timestamp with time zone default current_timestamp, 
 server_id varchar(100) not null, 
 constraint fk_server_id foreign key (server_id) references servers(id) on
delete cascade
);


--messages
create table if not exists messages(
 id varchar(100) default uuid_generate_v4() primary key, 
 content text, 
 is_read boolean default false, 
 user_id varchar(100) not null, 
 image_url text, image_asset_id varchar(100), 
constraint fk_user_id foreign key (user_id) references users(id) on delete cascade,
created_at timestamp with time zone default current_timestamp,
updated_at timestamp with time zone default current_timestamp
);

--channel-messages
create table if not exists channel_messages (
channel_id VARCHAR(100) not null,
message_id VARCHAR(100) not null, 
primary key(channel_id, message_id), 
constraint fk_channel_id foreign key (channel_id) references channels(id) on delete cascade ,
constraint fk_message_id foreign key (message_id) references messages(id) on delete cascade 
)

CREATE TABLE user_messages (
 message_id VARCHAR(100) NOT NULL,
 recipient_id VARCHAR(100) NOT NULL,
 is_read BOOLEAN DEFAULT FALSE,
 PRIMARY KEY (message_id, recipient_id),
 CONSTRAINT fk_message_id FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
 CONSTRAINT fk_recipient_id FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

--pinned message
create table if not exists channel_pinned_messages( 
 messages_id varchar(100) not null, 
 channel_id varchar(100), 
 primary key(messages_id, channel_id), 
 constraint fk_channel_id foreign key (channel_id) references channels(id) on
delete cascade,
constraint fk_message_id foreign key (messages_id) references messages(id) on
delete cascade
)


create table if not exists friends(
user_id1 varchar(100) not null, 
user_id2 varchar(100) not null,
primary key(user_id1, user_id2),
constraint fk_user_id1 foreign key (user_id1) references users(id),
constraint fk_user_id2 foreign key (user_id2) references users(id)
);

create table if not exists invitations(
user_to_invite varchar(100) not null,
invitator varchar(100) not null,
primary key(user_to_invite, invitator),
constraint fk_user_to_invite  foreign key(user_to_invite) references users(id) on delete cascade,
constraint fk_invitator foreign key(invitator) references users(id) on delete cascade
)


create table if not exists shop_items(
  id uuid primary key default uuid_generate_v4(), 
  type varchar(100) not null, 
  name varchar(100) not null, 
  descriptions text not null, 
  price decimal(10, 2) default 0, 
  image_url varchar(255) not null
);

create table if not exists server_emoji( 
 id uuid primary key default uuid_generate_v4(),
 name varchar(100) not null, 
 image varchar(100) not null,
 image_asset_id text,
)

create table if not exists bans(
user_id varchar(100) not null, server_id varchar(100) not null, channel_id varchar(100) not null, primary key(user_id, server_id, channel_id), constraint fk_server_id foreign key (server_id) references servers(id), constraint fk_user_id foreign key (user_id) references users(id), constraint fk_channel_id foreign key (channel_id) references channels(id) on
delete cascade on
update cascade
)
--unused
create table if not exists soundboard( 
 id uuid primary key default uuid_generate_v4(), name varchar(100) not null, emoji varchar(100) not null, uploaded_by varchar(100), created_at timestamp with time zone default current_timestamp, updated_at timestamp with time zone default current_timestamp, constraint fk_uploaded_by_id foreign key (uploaded_by) references users(id)
)

create table if not exists stickers( 
 id uuid primary key default uuid_generate_v4(), name varchar(100) not null, asset_id text, image varchar(100) not null, uploaded_by varchar(100) not null, created_at timestamp with time zone default current_timestamp, updated_at timestamp with time zone default current_timestamp, constraint fk_uploaded_by_id foreign key (uploaded_by) references users(id)
)



