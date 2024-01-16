resource "aws_lambda_function" "lambda" {
  filename      = ""
  function_name = var.lamda_obj.function_name
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  role          = var.role_arn
}
resource "aws_lambda_permission" "allow_api_gateway_to_invoke_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.arn
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.users_api.execution_arn}/*/*/${var.lamda_obj.route}"
}