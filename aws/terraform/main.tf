terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "SmartWasteManagement"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# 1. Media S3 Bucket
resource "aws_s3_bucket" "waste_media" {
  bucket_prefix = "${var.environment}-smartwaste-media-"
  force_destroy = false
}

resource "aws_s3_bucket_public_access_block" "waste_media_block" {
  bucket = aws_s3_bucket.waste_media.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "waste_media_encrypt" {
  bucket = aws_s3_bucket.waste_media.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 2. SNS Alert Topic
resource "aws_sns_topic" "dispatch_alerts" {
  name         = "${var.environment}-smartwaste-alerts"
  display_name = "Smart Waste Dispatch Alerts"
}

# 3. ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.environment}-smartwaste-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# 4. CloudWatch Log Group
resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/ecs/${var.environment}-smartwaste"
  retention_in_days = 30
}
