locals {
  lambda_config = jsondecode(data.aws_s3_bucket_object.config.body)
  lambda_arns   = [for lambda, value in local.lambda_config : module.lambda[lambda].lambda_invoke_arn]
}

module "iam" {
  source             = "./Module/IAM"
  s3_arn             = module.s3.s3_arn
  secret_manager_arn = module.rds.secret_manager_arn
}
module "lambda" {
  for_each  = local.lambda_config
  source    = "./Module/Lambda"
  lamda_obj = each.value

  role_arn          = module.iam.role_arn
  api_execution_arn = module.apigateway.api_execution_arn
  db_host = module.rds.proxy_url
  db_password = var.db_password
  security_group_ids = module.sg_module.security_group_ids
  subnet_ids = module.vpc_module.subnet_ids

}
module "apigateway" {
  source            = "./Module/Api_gateway"
  lambda_invoke_arn = local.lambda_arns
  lambda_config     = local.lambda_config
}

module "alb_module" {
  source          = "./Module/ALB"
  vpc_id          = module.vpc_module.vpc_id
  subnets         = module.vpc_module.subnet_ids
  security_groups = module.sg_module.security_group_ids
}

module "asg_module" {
  source          = "./Module/ASG"
  subnets         = module.vpc_module.subnet_ids
  vpc_id          = module.vpc_module.vpc_id
  security_groups = module.sg_module.security_group_ids
  key_name        = var.key_name
}

module "sg_module" {
  source = "./Module/Security-Group"
  vpc_id = module.vpc_module.vpc_id
}

module "vpc_module" {
  source                  = "./Module/VPC"
  cidr                    = "10.0.0.0/16"
  name                    = "project_vpc"
  subnets_cidr            = var.subnets_cidr
  availability_zones      = var.availability_zones
  map_public_ip_on_launch = true
}
module "rds" {
  source             = "./Module/RDS"
  security_group_ids = module.sg_module.security_group_ids
  subnet_ids         = module.vpc_module.subnet_ids
  rds_role_arn       = module.iam.rds_role_arn
  db_password        = var.db_password
}

module "s3" {
  source = "./Module/S3"
}

module "ecr" {
  source = "./Module/ECR"
}
