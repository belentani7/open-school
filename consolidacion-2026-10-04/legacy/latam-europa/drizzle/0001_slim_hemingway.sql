CREATE TABLE `sourceChecks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceSlug` varchar(64) NOT NULL,
	`runKey` varchar(100) NOT NULL,
	`checkedAt` timestamp NOT NULL,
	`status` enum('verified','failed') NOT NULL,
	`statusCode` int,
	`resolvedUrl` varchar(2048) NOT NULL,
	`detail` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sourceChecks_id` PRIMARY KEY(`id`),
	CONSTRAINT `sourceChecks_runKey_unique` UNIQUE(`runKey`)
);
--> statement-breakpoint
CREATE TABLE `sourceMonitoringJobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`monitorKey` varchar(64) NOT NULL,
	`scheduleCronTaskUid` varchar(65),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sourceMonitoringJobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `sourceMonitoringJobs_monitorKey_unique` UNIQUE(`monitorKey`)
);
--> statement-breakpoint
CREATE INDEX `source_checks_slug_checked_idx` ON `sourceChecks` (`sourceSlug`,`checkedAt`);--> statement-breakpoint
CREATE INDEX `source_monitoring_task_uid_idx` ON `sourceMonitoringJobs` (`scheduleCronTaskUid`);