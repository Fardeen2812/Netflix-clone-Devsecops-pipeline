resource "aws_cloudwatch_log_group" "catalog" {
    name = "/ecs/catalog-service"
    retention_in_days = 30
}   

resource "aws_cloudwatch_log_group" "api_gateway" {
    name = "/ecs/api-gateway"
    retention_in_days = 30
}   

resource "aws_cloudwatch_log_group" "jenkins" {
    name = "/ecs/jenkins"
    retention_in_days = 30
}   
