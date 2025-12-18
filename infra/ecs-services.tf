resource "aws_ecs_service" "catalog" {
    name            = "${var.project_name}-catalog-service"
    cluster         = aws_ecs_cluster.my-project.id
    task_definition = aws_ecs_task_definition.catalog.arn
    desired_count   = 1
    launch_type     = "FARGATE"
    
    network_configuration {
        subnets         = aws_subnet.public_subnet[*].id
        security_groups = [aws_security_group.ecs_sg.id]
        assign_public_ip = true
    }

    load_balancer {
        target_group_arn = aws_lb_target_group.catalog.arn
        container_name   = "catalog-service"
        container_port   = 8081
    }

    depends_on = [aws_lb_listener.http]

    lifecycle {
        ignore_changes = [task_definition]
    }
}

resource "aws_ecs_service" "api_gateway" {
    name            = "${var.project_name}-api-gateway-service"
    cluster         = aws_ecs_cluster.my-project.id
    task_definition = aws_ecs_task_definition.api_gateway.arn
    desired_count   = 1
    launch_type     = "FARGATE"
    
    network_configuration {
        subnets         = aws_subnet.public_subnet[*].id
        security_groups = [aws_security_group.ecs_sg.id]
        assign_public_ip = true
    }
    
    load_balancer {
        target_group_arn = aws_lb_target_group.api_gateway.arn
        container_name   = "api-gateway"
        container_port   = 8080
    }
    
    depends_on = [aws_lb_listener.http]

    lifecycle {
        ignore_changes = [task_definition]
    }
}
  
