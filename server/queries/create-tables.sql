CREATE TABLE "Users" (
    "id" varchar(6) PRIMARY KEY,
    "username" varchar(50) UNIQUE NOT NULL,
    "firstname" varchar(25),
    "lastname" varchar(25),
    "image_url" varchar(255),
    "last_active" timestamp DEFAULT (now()),
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "SigninOptions" (
    "user_id" varchar(6),
    "service_name" varchar(50) NOT NULL,
    "email" varchar(320) NOT NULL,
    "token" varchar(255) NOT NULL,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now()),
    PRIMARY KEY ("user_id", "service_name")
);

CREATE TABLE "Contacts" (
    "contact_id" varchar(6),
    "user_id" varchar(6),
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now()),
    PRIMARY KEY ("contact_id", "user_id")
);

CREATE TABLE "Conversations" (
    "id" varchar(128) PRIMARY KEY,
    "title" varchar(25) NOT NULL,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "Participants" (
    "user_id" varchar(6),
    "conversation_id" varchar(128),
    "is_admin" boolean DEFAULT false,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now()),
    PRIMARY KEY ("user_id", "conversation_id")
);

CREATE TABLE "Messages" (
    "id" varchar(128) PRIMARY KEY,
    "content" varchar(512) NOT NULL,
    "conversation_id" varchar(128),
    "user_id" varchar(6),
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

ALTER TABLE "SigninOptions" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

ALTER TABLE "Contacts" ADD FOREIGN KEY ("contact_id") REFERENCES "Users" ("id");

ALTER TABLE "Contacts" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

ALTER TABLE "Participants" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

ALTER TABLE "Participants" ADD FOREIGN KEY ("conversation_id") REFERENCES "Conversations" ("id");

ALTER TABLE "Messages" ADD FOREIGN KEY ("conversation_id") REFERENCES "Conversations" ("id");

ALTER TABLE "Messages" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

CREATE INDEX ON "Messages" ("conversation_id", "created_at");
