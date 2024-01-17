locals {
  lambda_config = jsondecode(data.aws_s3_bucket_object.config.body)
  lambda_arns   = [for lambda, value in local.lambda_config : module.lambda[lambda].lambda_invoke_arn]
}

module "iam" {
  source       = "./Module/IAM"
  dynamodb_arn = ""
  s3_arn       = ""
}
module "lambda" {
  for_each  = local.lambda_config
  source    = "./Module/Lambda"
  lamda_obj = each.value

  role_arn          = module.iam.role_arn
  api_execution_arn = module.apigateway.api_execution_arn
}
module "apigateway" {
  source            = "./Module/Api_gateway"
  lambda_invoke_arn = local.lambda_arns
  lambda_config     = local.lambda_config
}



