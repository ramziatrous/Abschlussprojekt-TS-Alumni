output "rds_endpunkt" {
    value = aws_db_instance.default.address
}
output "secret_manager_arn" {
  value = aws_secretsmanager_secret.secret.arn
}
output "db_password" {
  value = aws_db_instance.default.password
}
output "db_name" {
  value = aws_db_instance.default.db_name
}
output "db_user_name" {
  value = aws_db_instance.default.username
}