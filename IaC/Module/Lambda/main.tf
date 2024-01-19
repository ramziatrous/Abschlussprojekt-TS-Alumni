resource "aws_lambda_function" "lambda" {
  function_name = var.lamda_obj.function_name
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  role          = var.role_arn

  s3_bucket         = "tfstate-bucket-abschlussproject"
  s3_key            = "functions_code/${var.lamda_obj.function_name}.zip"

  environment {
    variables = {
      TSNET_DB_DATABASE = "TS_AlumniNetwork",
      TSNET_DB_DIALECT  = "mysql",
      TSNET_DB_HOST     = var.db_host,
      TSNET_DB_PASSWORD = var.db_password,
      TSNET_DB_PORT     = "3306",
      SNET_DB_USER      = "admin"
    }
  }
  vpc_config {
    subnet_ids = var.subnet_ids
    security_group_ids = [var.security_group_ids]
  }
}
resource "aws_lambda_permission" "allow_api_gateway_to_invoke_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.arn
  principal     = "apigateway.amazonaws.com"

  source_arn = "${var.api_execution_arn}/*/*/${var.lamda_obj.route}"
}