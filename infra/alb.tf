resource "aws_alb" "my-project" {
    name = "${var.project_name}-alb"
    security_groups = [aws_security_group.alb_sg.id]
    subnets = aws_subnet.public_subnet[*].id
    load_balancer_type = "application"

    tags = {
        Name = "${var.project_name}-alb"
    }
  
}

resource "aws_lb_target_group" "api_gateway" {
    name     = "${var.project_name}-api-gateway-tg"
    port     = 80
    protocol = "HTTP"
    vpc_id   = aws_vpc.my_vpc.id
    target_type = "ip"

    health_check {
        path                = "/health"
        protocol            = "HTTP"
        matcher             = "200-399"
        interval            = 30
        timeout             = 5
        healthy_threshold   = 2
        unhealthy_threshold = 2
    }
  
}

resource "aws_lb_listener" "http" {
    load_balancer_arn = aws_alb.my-project.arn
    port              = "80"
    protocol          = "HTTP"

    default_action {
        type             = "forward"
        target_group_arn = aws_lb_target_group.api_gateway.arn
    }
}

resource "aws_lb_target_group" "catalog" {
    name     = "${var.project_name}-catalog-tg"
    port     = 8081
    protocol = "HTTP"
    vpc_id   = aws_vpc.my_vpc.id
    target_type = "ip"

    health_check {
        path                = "/health"
        protocol            = "HTTP"
        matcher             = "200-399"
        interval            = 30
        timeout             = 5
        healthy_threshold   = 2
        unhealthy_threshold = 2
    }
}

resource "aws_lb_listener_rule" "catalog" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.catalog.arn
  }

  condition {
    path_pattern {
      values = ["/catalog/*"]
    }
  }
}

resource "aws_lb_target_group" "jenkins" {
    name     = "${var.project_name}-jenkins-tg"
    port     = 8080
    protocol = "HTTP"
    vpc_id   = aws_vpc.my_vpc.id
    target_type = "ip"

    health_check {
        path                = "/login"
        protocol            = "HTTP"
        matcher             = "200-399"
        interval            = 30
        timeout             = 5
        healthy_threshold   = 2
        unhealthy_threshold = 2
    }
}

resource "aws_lb_listener" "jenkins" {
    load_balancer_arn = aws_alb.my-project.arn
    port              = "8080"
    protocol          = "HTTP"

    default_action {
        type             = "forward"
        target_group_arn = aws_lb_target_group.jenkins.arn
    }
}