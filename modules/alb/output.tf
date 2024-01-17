output "dns_name" {
  description = "DNS name of ALB"
  value       = "http://${aws_lb.project_alb.dns_name}"
}
