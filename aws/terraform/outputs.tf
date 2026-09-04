output "s3_bucket_name" {
  value       = aws_s3_bucket.waste_media.id
  description = "Target S3 Bucket for photo attachments"
}

output "sns_topic_arn" {
  value       = aws_sns_topic.dispatch_alerts.arn
  description = "Amazon SNS Topic ARN for dispatch notifications"
}

output "ecs_cluster_id" {
  value       = aws_ecs_cluster.main.id
  description = "ECS Fargate Cluster ID"
}
