CREATE TABLE "Users" (
    "id" int PRIMARY KEY,
    "display_name" varchar(50) UNIQUE NOT NULL,
    "first_name" varchar(50),
    "last_name" varchar(50),
    "image_url" varchar(2048),
    "last_active" timestamp DEFAULT (now()),
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "SigninOptions" (
    "service_name" varchar(20) NOT NULL,
    "email" varchar(320) NOT NULL,
    "user_id" int,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now()),
    PRIMARY KEY ("service_name", "email")
);

CREATE TABLE "Contacts" (
    "contact_id" int,
    "user_id" int,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now()),
    PRIMARY KEY ("contact_id", "user_id")
);

CREATE TABLE "Conversations" (
    "id" bigint PRIMARY KEY,
    "title" varchar(25),
    "image_url" varchar(2048),
    "user_editable_image" boolean DEFAULT false,
    "user_editable_title" boolean DEFAULT false,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "Participants" (
    "user_id" int,
    "conversation_id" bigint,
    "is_admin" boolean DEFAULT false,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now()),
    PRIMARY KEY ("user_id", "conversation_id")
);

CREATE TABLE "Messages" (
    "id" bigint PRIMARY KEY,
    "content" text NOT NULL,
    "conversation_id" bigint,
    "sender_id" int,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

ALTER TABLE "SigninOptions" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

ALTER TABLE "Contacts" ADD FOREIGN KEY ("contact_id") REFERENCES "Users" ("id");

ALTER TABLE "Contacts" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

ALTER TABLE "Participants" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

ALTER TABLE "Participants" ADD FOREIGN KEY ("conversation_id") REFERENCES "Conversations" ("id");

ALTER TABLE "Messages" ADD FOREIGN KEY ("conversation_id") REFERENCES "Conversations" ("id");

ALTER TABLE "Messages" ADD FOREIGN KEY ("sender_id") REFERENCES "Users" ("id");

CREATE INDEX ON "Messages" ("conversation_id", "created_at");
