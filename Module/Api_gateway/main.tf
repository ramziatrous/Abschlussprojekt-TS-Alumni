resource "aws_apigatewayv2_api" "api" {
  name          = "api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_headers = ["*"]
    allow_methods = ["POST", "GET", "DELETE","PUT"]
  }
}
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}
resource "aws_apigatewayv2_integration" "lambda_integration" {
  for_each        = data.aws_s3_bucket_object.config
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_method = each.value.http_Methode
  integration_uri    = var.lambda_invoke_arn
}
resource "aws_apigatewayv2_route" "lambda_route" {
  for_each        = data.aws_s3_bucket_object.config
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "${each.value.http_Methode} /${each.value.route}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}