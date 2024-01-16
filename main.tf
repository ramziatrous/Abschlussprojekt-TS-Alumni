module "iam" {
  source = "./Module/IAM"
  dynamodb_arn = ""
  s3_arn       = ""
}


module "lambda" {
  for_each     = data.aws_s3_bucket_object.config
  source       = "./Module/Lambda"
  lamda_obj    = each.value
  
  role_arn = module.iam.role_arn

}
module "apigateway" {
  source = "./Module/Api_gateway"
  
  lambda_invoke_arn= module.lambda.lambda_invoke_arn
}
