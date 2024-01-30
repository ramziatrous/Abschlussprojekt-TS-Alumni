output "api_gw_url" {
  value = module.apigateway.api_gw_url
}
output "db_endpoint" {
  value = module.rds.rds_endpunkt
}
output "db_password" {
  value     = module.rds.db_password
  sensitive = true
}
output "db_name" {
  value = module.rds.db_name
}
output "db_username" {
  value = module.rds.db_user_name
}
output "ecr_url" {
  value = module.ecr.ecr_url
}
output "proxy_url" {
  value = module.rds.proxy_url
}
