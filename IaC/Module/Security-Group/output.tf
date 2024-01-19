output "security_group_ids" {
  description = "ID of the security groups"
  value       = aws_security_group.project_sg.id
}
