variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "Target AWS Region"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Environment identifier (dev, staging, production)"
}

variable "app_port" {
  type        = number
  default     = 5000
  description = "Port exposed by the application server"
}
