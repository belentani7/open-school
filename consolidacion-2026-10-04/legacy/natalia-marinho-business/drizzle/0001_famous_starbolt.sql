CREATE TABLE `bookingRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`email` varchar(320) NOT NULL,
	`message` text,
	`service` varchar(160) NOT NULL DEFAULT 'Experiencia privada',
	`status` enum('new','contacted','confirmed','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookingRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`language` enum('ES','PT') NOT NULL DEFAULT 'ES',
	`source` varchar(120) NOT NULL DEFAULT 'website',
	`status` enum('active','unsubscribed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `leads_email_unique` UNIQUE(`email`)
);
