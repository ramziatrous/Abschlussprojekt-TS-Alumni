resource "aws_lambda_function" "lambda" {
  function_name = var.lamda_obj.function_name
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  role          = var.role_arn

  s3_bucket         = "tfstate-bucket-abschlussproject"
  s3_key            = "functions_code/${var.lamda_obj.function_name}.zip"

}
resource "aws_lambda_permission" "allow_api_gateway_to_invoke_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.arn
  principal     = "apigateway.amazonaws.com"

  source_arn = "${var.api_execution_arn}/*/*/${var.lamda_obj.route}"
}