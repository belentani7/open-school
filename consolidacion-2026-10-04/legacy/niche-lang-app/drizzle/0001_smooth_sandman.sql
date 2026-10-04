CREATE TABLE `sync_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`actionId` varchar(128) NOT NULL,
	`actionType` enum('progress','stats','profile') NOT NULL,
	`payload` text NOT NULL,
	`clientTimestamp` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sync_actions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sync_actions_user_action_unique` UNIQUE(`userId`,`actionId`)
);
