output "role_arn" {
  value = aws_iam_role.lambda_role.arn
}

output "rds_role_arn" {
  value = aws_iam_role.rds_role.arn
}