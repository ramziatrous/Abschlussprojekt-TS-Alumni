output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.project_vpc.id
}

output "subnet_ids" {
  description = "The IDs of the subnets"
  value       = aws_subnet.project_subnet[*].id
}
