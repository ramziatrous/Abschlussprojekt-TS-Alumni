resource "aws_lb" "project_alb" {
  name               = "project-alb"
  load_balancer_type = "application"
  subnets            = var.subnets
  tags = {
    Name = "project_alb"
  }
}

resource "aws_lb_target_group" "project_tg" {
  target_type = "instance"
  name        = "project-alb-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 3
    interval            = 30
    matcher             = "200"
    path                = "/"
    port                = 80
    protocol            = "HTTP"
    timeout             = 10
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "project_alb_listener" {
  load_balancer_arn = aws_lb.project_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.project_tg.arn
  }
}
