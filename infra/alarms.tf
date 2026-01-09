resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
  alarm_name          = "${var.project_name}-alb-5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 5

  dimensions = {
    LoadBalancer = aws_alb.my-project.arn_suffix
  }

  alarm_description = "ALB returning 5XX errors"
}


resource "aws_cloudwatch_metric_alarm" "ecs_task_restarts" {
    alarm_name = "${var.project_name}-ecs-task-restarts-alarm"
    comparison_operator = "GreaterThanThreshold"
    evaluation_periods = "1"
    metric_name = "TaskStopped"
    namespace = "AWS/ECS"
    period = 300
    statistic = "Sum"
    threshold = 1
   
   dimensions = {
    ClusterName = aws_ecs_cluster.my-project.name   
   }

   alarm_description = "ECS tasks restarting unexpectedly"
}