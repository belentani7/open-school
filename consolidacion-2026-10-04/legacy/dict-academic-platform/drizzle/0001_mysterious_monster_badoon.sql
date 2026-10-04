CREATE TABLE `academic_programs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`currentVersion` varchar(24) NOT NULL,
	`internalCreditName` varchar(80) NOT NULL DEFAULT 'Créditos Académicos Internos (CA)',
	`totalCredits` int NOT NULL,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `academic_programs_id` PRIMARY KEY(`id`),
	CONSTRAINT `academic_programs_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `assessment_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`assessmentType` enum('quiz','practice','lab','project','research','defense') NOT NULL,
	`weight` int NOT NULL,
	`maximumScore` int NOT NULL DEFAULT 100,
	`title` varchar(220) NOT NULL,
	`dueAt` timestamp,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `assessment_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentItemId` int NOT NULL,
	`userId` int NOT NULL,
	`score` int,
	`feedback` text,
	`submittedAt` timestamp,
	`gradedAt` timestamp,
	`gradedByUserId` int,
	CONSTRAINT `assessment_submissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `assessment_submissions_item_user_unique` UNIQUE(`assessmentItemId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`certificateType` enum('completion','competency','specialization','professional_project','research_project') NOT NULL,
	`verificationCode` varchar(64) NOT NULL,
	`programVersion` varchar(24) NOT NULL,
	`awardedCredits` int NOT NULL,
	`competencySnapshot` json NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	`revokedAt` timestamp,
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_verification_code_unique` UNIQUE(`verificationCode`)
);
--> statement-breakpoint
CREATE TABLE `competencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(48) NOT NULL,
	`domain` enum('software','ai','cloud','cybersecurity','research','professional') NOT NULL,
	`name` varchar(180) NOT NULL,
	`description` text NOT NULL,
	CONSTRAINT `competencies_id` PRIMARY KEY(`id`),
	CONSTRAINT `competencies_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `course_prerequisites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`prerequisiteCourseId` int NOT NULL,
	`minimumGrade` int NOT NULL DEFAULT 65,
	CONSTRAINT `course_prerequisites_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_prerequisites_unique` UNIQUE(`courseId`,`prerequisiteCourseId`)
);
--> statement-breakpoint
CREATE TABLE `course_resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`locale` enum('es','pt','en') NOT NULL,
	`title` varchar(220) NOT NULL,
	`url` varchar(2048) NOT NULL,
	`resourceType` enum('official_docs','book','university','paper','repository','dataset','lab','video') NOT NULL,
	`accessType` enum('free','open_source','commercial') NOT NULL DEFAULT 'free',
	`license` varchar(160),
	`note` text,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`locale` enum('es','pt','en') NOT NULL,
	`title` varchar(220) NOT NULL,
	`summary` text NOT NULL,
	`objectives` json NOT NULL,
	`competencies` json NOT NULL,
	`syllabus` json NOT NULL,
	`exercises` json NOT NULL,
	`labBrief` text NOT NULL,
	`projectBrief` text NOT NULL,
	`rubric` json NOT NULL,
	`aiUsePolicy` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `course_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_translations_course_locale_unique` UNIQUE(`courseId`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`programId` int NOT NULL,
	`code` varchar(24) NOT NULL,
	`semester` int NOT NULL,
	`credits` int NOT NULL,
	`estimatedHours` int NOT NULL,
	`masteryEntry` enum('A','B','C','D','E','F') NOT NULL,
	`masteryExit` enum('A','B','C','D','E','F') NOT NULL,
	`track` enum('foundation','software','ai','cloud','cybersecurity','research','creative') NOT NULL,
	`academicStatus` enum('draft','published','archived') NOT NULL DEFAULT 'published',
	`assessmentWeights` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_program_code_unique` UNIQUE(`programId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `curriculum_change_proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceUrl` varchar(2048) NOT NULL,
	`sourceType` enum('model','framework','vulnerability','standard','paper','regulation') NOT NULL,
	`proposedVersion` varchar(24) NOT NULL,
	`summary` text NOT NULL,
	`impactAssessment` text NOT NULL,
	`status` enum('proposed','under_review','approved','rejected','superseded') NOT NULL DEFAULT 'proposed',
	`reviewedByUserId` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `curriculum_change_proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`status` enum('planned','in_progress','completed','blocked','withdrawn') NOT NULL DEFAULT 'planned',
	`progressPercent` int NOT NULL DEFAULT 0,
	`finalGrade` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`),
	CONSTRAINT `enrollments_user_course_unique` UNIQUE(`userId`,`courseId`)
);
--> statement-breakpoint
CREATE TABLE `file_references` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerUserId` int,
	`projectId` int,
	`storageKey` varchar(512) NOT NULL,
	`displayName` varchar(255) NOT NULL,
	`mimeType` varchar(128) NOT NULL,
	`sizeBytes` int NOT NULL,
	`accessLevel` enum('private','course','public') NOT NULL DEFAULT 'private',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `file_references_id` PRIMARY KEY(`id`),
	CONSTRAINT `file_references_storage_key_unique` UNIQUE(`storageKey`)
);
--> statement-breakpoint
CREATE TABLE `student_competencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`competencyId` int NOT NULL,
	`masteryLevel` enum('A','B','C','D','E','F') NOT NULL,
	`evidenceUrl` varchar(2048),
	`verifiedAt` timestamp,
	CONSTRAINT `student_competencies_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_competencies_user_competency_unique` UNIQUE(`userId`,`competencyId`)
);
--> statement-breakpoint
CREATE TABLE `student_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`preferredLocale` enum('es','pt','en') NOT NULL DEFAULT 'es',
	`bio` text,
	`headline` varchar(180),
	`portfolioSlug` varchar(96),
	`portfolioPublic` int NOT NULL DEFAULT 0,
	`onboardingComplete` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_profiles_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `student_profiles_portfolioSlug_unique` UNIQUE(`portfolioSlug`)
);
--> statement-breakpoint
CREATE TABLE `student_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int,
	`title` varchar(220) NOT NULL,
	`summary` text NOT NULL,
	`repositoryUrl` varchar(2048),
	`demoUrl` varchar(2048),
	`coverFileKey` varchar(512),
	`visibility` enum('private','public') NOT NULL DEFAULT 'private',
	`technologies` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tutor_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int,
	`role` enum('student','tutor') NOT NULL,
	`content` text NOT NULL,
	`mode` enum('explain','socratic','hint','practice','interview','defense') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tutor_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `assessment_items` ADD CONSTRAINT `assessment_items_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessment_submissions` ADD CONSTRAINT `assessment_submissions_assessmentItemId_assessment_items_id_fk` FOREIGN KEY (`assessmentItemId`) REFERENCES `assessment_items`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessment_submissions` ADD CONSTRAINT `assessment_submissions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessment_submissions` ADD CONSTRAINT `assessment_submissions_gradedByUserId_users_id_fk` FOREIGN KEY (`gradedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_prerequisites` ADD CONSTRAINT `course_prerequisites_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_prerequisites` ADD CONSTRAINT `course_prerequisites_prerequisiteCourseId_courses_id_fk` FOREIGN KEY (`prerequisiteCourseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_resources` ADD CONSTRAINT `course_resources_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_translations` ADD CONSTRAINT `course_translations_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_programId_academic_programs_id_fk` FOREIGN KEY (`programId`) REFERENCES `academic_programs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `curriculum_change_proposals` ADD CONSTRAINT `curriculum_change_proposals_reviewedByUserId_users_id_fk` FOREIGN KEY (`reviewedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `file_references` ADD CONSTRAINT `file_references_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `file_references` ADD CONSTRAINT `file_references_projectId_student_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `student_projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_competencies` ADD CONSTRAINT `student_competencies_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_competencies` ADD CONSTRAINT `student_competencies_competencyId_competencies_id_fk` FOREIGN KEY (`competencyId`) REFERENCES `competencies`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_profiles` ADD CONSTRAINT `student_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_projects` ADD CONSTRAINT `student_projects_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_projects` ADD CONSTRAINT `student_projects_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tutor_messages` ADD CONSTRAINT `tutor_messages_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tutor_messages` ADD CONSTRAINT `tutor_messages_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `course_prerequisites_course_idx` ON `course_prerequisites` (`courseId`);--> statement-breakpoint
CREATE INDEX `course_resources_course_idx` ON `course_resources` (`courseId`);--> statement-breakpoint
CREATE INDEX `courses_semester_idx` ON `courses` (`semester`);--> statement-breakpoint
CREATE INDEX `courses_track_idx` ON `courses` (`track`);--> statement-breakpoint
CREATE INDEX `curriculum_change_proposals_status_idx` ON `curriculum_change_proposals` (`status`);--> statement-breakpoint
CREATE INDEX `enrollments_user_status_idx` ON `enrollments` (`userId`,`status`);--> statement-breakpoint
CREATE INDEX `student_projects_user_visibility_idx` ON `student_projects` (`userId`,`visibility`);--> statement-breakpoint
CREATE INDEX `tutor_messages_user_created_idx` ON `tutor_messages` (`userId`,`createdAt`);