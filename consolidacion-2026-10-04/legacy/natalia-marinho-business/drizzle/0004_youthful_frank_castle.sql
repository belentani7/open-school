CREATE TABLE `collaborationRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`email` varchar(320) NOT NULL,
	`organization` varchar(180),
	`city` varchar(100) NOT NULL DEFAULT 'Barcelona',
	`proposalType` varchar(120) NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','reviewing','contacted','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collaborationRequests_id` PRIMARY KEY(`id`)
);
