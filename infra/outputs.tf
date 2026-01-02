output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.my_vpc.id
  
}
output "public_subnet_ids" {
  description = "The IDs of the public subnets"
  value       = aws_subnet.public_subnet[*].id
  
}
output "alb_security_group_id" {
  description = "The ID of the ALB security group"
  value       = aws_security_group.alb_sg.id    
}
output "ecs_security_group_id" {
  description = "The ID of the ECS security group"
  value       = aws_security_group.ecs_sg.id  
}

output "catalog_ecr_repository_url" {
  value       = aws_ecr_repository.catalog_service.repository_url 
}

output "api_gateway_ecr_url" {
  value = aws_ecr_repository.api_gateway.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.my-project.name
}

output "ecs_task_execution_role_arn" {
  value = aws_iam_role.ecs_task_execution_role.arn  
}

output "jenkins_ecr_url" {
  value = aws_ecr_repository.jenkins.repository_url
}