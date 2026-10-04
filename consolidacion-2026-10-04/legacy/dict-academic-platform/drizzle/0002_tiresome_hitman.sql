CREATE TABLE `curriculum_review_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scope` varchar(32) NOT NULL,
	`scheduleCronTaskUid` varchar(65),
	`cronExpression` varchar(64) NOT NULL,
	`enabled` int NOT NULL DEFAULT 0,
	`sourceUrls` json NOT NULL,
	`lastRunAt` timestamp,
	`lastOutcome` varchar(48),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `curriculum_review_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `curriculum_review_settings_scope_unique` UNIQUE(`scope`)
);
--> statement-breakpoint
CREATE INDEX `curriculum_review_settings_task_uid_idx` ON `curriculum_review_settings` (`scheduleCronTaskUid`);