resource "aws_lambda_function" "lambda" {
  function_name = var.lamda_obj.function_name
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_role.arn

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


resource "aws_iam_role" "lambda_role" {
  name = "${var.lamda_obj.function_name}_role"
  assume_role_policy = jsonencode({
    Version : "2012-10-17",
    Statement : [
      {
        Action : "sts:AssumeRole",
        Effect : "Allow",
        Principal : {
          Service : "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_policy" {
  name = "${var.lamda_obj.function_name}_policy"
  policy = jsonencode({
    Version : "2012-10-17",
    Statement : [
      {
        "Effect" : "Allow",
        "Action" : ["s3:GetObject",
          "s3:PutObject"
        ],
        "Resource" : "${var.s3_arn}"
      },
      {
            "Effect": "Allow",
            "Action": "logs:CreateLogGroup",
            "Resource": "arn:aws:logs:eu-central-1:048479317518:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:eu-central-1:048479317518:log-group:/aws/lambda/${var.lamda_obj.function_name}:*"
            ]
        },
      {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateNetworkInterface",
                "ec2:DeleteNetworkInterface",
                "ec2:DescribeNetworkInterfaces"
            ],
            "Resource": "*"
        }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {

  policy_arn = aws_iam_policy.lambda_policy.arn
  role       = aws_iam_role.lambda_role.name
}
