-- Migration: Add imageUrl column to products table
-- Run this script if the column does not exist yet

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL;
