variable "security_group_ids" {}
variable "subnet_ids" {
    type = set(string)
}
variable "rds_role_arn" {}