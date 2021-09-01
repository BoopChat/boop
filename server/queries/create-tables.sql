CREATE TABLE "Users" (
    "id" varchar(11) PRIMARY KEY,
    "username" varchar(50) UNIQUE NOT NULL,
    "firstname" varchar(25),
    "lastname" varchar(25),
    "last_active" timestamp,
    "image_url" varchar(255)
);

CREATE TABLE "SigninOptions" (
    "user_id" varchar(11),
    "service_name" varchar(50) NOT NULL,
    "email" varchar(320) NOT NULL,
    "token" varchar(255) NOT NULL,
    PRIMARY KEY ("user_id", "service_name")
);

CREATE TABLE "Contacts" (
    "contact_id" varchar(11),
    "user_id" varchar(11),
    PRIMARY KEY ("contact_id", "user_id")
);

CREATE TABLE "Conversations" (
    "id" varchar(128) PRIMARY KEY,
    "title" varchar(25) NOT NULL,
    "started_at" timestamp DEFAULT (now())
);

CREATE TABLE "Participants" (
    "user_id" varchar(11),
    "conversation_id" varchar(128),
    "is_admin" boolean,
    PRIMARY KEY ("user_id", "conversation_id")
);

CREATE TABLE "Messages" (
    "id" varchar(128) PRIMARY KEY,
    "content" varchar(512) NOT NULL,
    "sent_at" timestamp DEFAULT (now()),
    "conversation_id" varchar(128),
    "user_id" varchar(11)
);

ALTER TABLE "SigninOptions" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

ALTER TABLE "Contacts" ADD FOREIGN KEY ("contact_id") REFERENCES "Users" ("id");

ALTER TABLE "Contacts" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

ALTER TABLE "Participants" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

ALTER TABLE "Participants" ADD FOREIGN KEY ("conversation_id") REFERENCES "Conversations" ("id");

ALTER TABLE "Messages" ADD FOREIGN KEY ("conversation_id") REFERENCES "Conversations" ("id");

ALTER TABLE "Messages" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

CREATE INDEX ON "Messages" ("conversation_id", "sent_at");
