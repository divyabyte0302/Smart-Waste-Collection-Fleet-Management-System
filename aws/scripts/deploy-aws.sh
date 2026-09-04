#!/bin/bash
# ==============================================================================
# AWS ECS / CloudFormation Deployment Automation Script
# ==============================================================================

set -e

STACK_NAME="smartwaste-production-stack"
REGION="us-east-1"
TEMPLATE_FILE="../cloudformation/template.yaml"

echo "=== Deploying Smart Waste Collection Management System to AWS ==="
echo "Stack: $STACK_NAME | Region: $REGION"

aws cloudformation deploy \
  --template-file "$TEMPLATE_FILE" \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
      EnvironmentName=production \
      ContainerPort=5000

echo "Deployment complete! Fetching outputs..."
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs" \
  --output table
