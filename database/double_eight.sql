-- ============================================================
-- Double Eight for Business Solutions
-- Database Schema — double_eight.sql
--
-- HOW TO IMPORT:
-- 1. Log in to your hosting cPanel
-- 2. Open phpMyAdmin
-- 3. Create a new database named: double_eight_db
-- 4. Select that database, click "Import"
-- 5. Upload this file and click "Go"
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+03:00";

-- ── Database ──────────────────────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS `doubvvoh_d8`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `doubvvoh_d8`;

-- ── Contacts Table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `contacts` (
  `id`          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(150)    NOT NULL,
  `email`       VARCHAR(255)    NOT NULL,
  `phone`       VARCHAR(30)     DEFAULT NULL,
  `service`     VARCHAR(100)    DEFAULT NULL,
  `message`     TEXT            NOT NULL,
  `ip_address`  VARCHAR(45)     DEFAULT NULL,
  `is_read`     TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Newsletter Table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `newsletter` (
  `id`              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `email`           VARCHAR(255)    NOT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address`      VARCHAR(45)     DEFAULT NULL,
  `is_active`       TINYINT(1)      NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Blog Posts Table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `title`         VARCHAR(255)    NOT NULL,
  `slug`          VARCHAR(255)    NOT NULL,
  `excerpt`       TEXT            DEFAULT NULL,
  `content`       LONGTEXT        NOT NULL,
  `category`      VARCHAR(100)    DEFAULT NULL,
  `author`        VARCHAR(150)    DEFAULT 'Double Eight Team',
  `is_published`  TINYINT(1)      NOT NULL DEFAULT 0,
  `published_at`  DATETIME        DEFAULT NULL,
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slug` (`slug`),
  INDEX `idx_published` (`is_published`, `published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Portfolio Projects Table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `portfolio_projects` (
  `id`          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(255)    NOT NULL,
  `client`      VARCHAR(150)    DEFAULT NULL,
  `category`    VARCHAR(100)    DEFAULT NULL,
  `description` TEXT            DEFAULT NULL,
  `image_url`   VARCHAR(500)    DEFAULT NULL,
  `sort_order`  INT             NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Sample Data: Portfolio Projects ──────────────────────────────────────
INSERT INTO `portfolio_projects` (`title`, `client`, `category`, `description`, `is_featured`, `sort_order`) VALUES
('Digital Transformation', 'Qatar Financial Centre', 'seo', 'Full SEO and digital strategy overhaul resulting in 340% organic traffic growth.', 1, 1),
('Brand Identity', 'Al Maha Luxury Real Estate', 'branding', 'Complete visual identity system for a premium real estate developer.', 1, 2),
('Mobile App Redesign', 'Doha Bank', 'cx', 'UX/UI redesign of mobile banking application improving NPS by 42 points.', 1, 3),
('E-commerce Optimization', 'Ooredoo', 'seo', 'Technical SEO and conversion rate optimization for telecom e-commerce.', 0, 4),
('B2B Portal Launch', 'Qatar Airways', 'branding', 'Design and launch of enterprise B2B booking portal.', 0, 5),
('Patient Portal', 'Hamad Medical Corporation', 'cx', 'Patient-facing digital portal improving healthcare access and experience.', 0, 6);

-- ── Sample Data: Blog Posts ───────────────────────────────────────────────
INSERT INTO `blog_posts` (`title`, `slug`, `excerpt`, `content`, `category`, `author`, `is_published`, `published_at`) VALUES
(
  'The Future of Search in Qatar: Navigating AI Overviews and Bilingual SEO',
  'future-of-search-qatar-ai-bilingual-seo',
  'As search engines increasingly integrate generative AI, the rules of visibility are changing. Learn how Qatari businesses must adapt.',
  '<p>The search landscape in Qatar is undergoing a fundamental transformation. With Google''s AI Overviews now appearing for a growing percentage of queries, and with Bing Copilot reshaping how users interact with search results, businesses that rely on traditional SEO tactics face a critical inflection point.</p><p>The unique challenge for Qatari businesses lies in the bilingual nature of the market. A robust digital presence requires not just Arabic and English content, but content that is culturally calibrated for each audience segment...</p>',
  'SEO Strategy',
  'Double Eight Team',
  1,
  '2026-04-02 09:00:00'
),
(
  'Building Cultural Resonance in GCC Brand Identities',
  'building-cultural-resonance-gcc-brand-identities',
  'How to balance global design aesthetics with local cultural nuances when developing brand identities for the Middle Eastern market.',
  '<p>The most successful brands in the GCC are those that have mastered the art of cultural resonance — the ability to speak to a local audience in a way that feels both globally sophisticated and authentically local...</p>',
  'Branding',
  'Khalid Rahman',
  1,
  '2026-03-18 09:00:00'
);
