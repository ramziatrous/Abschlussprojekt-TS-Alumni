resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"
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
  name = "lambda_policy"
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

resource "aws_iam_role" "rds_role" {
  name = "rds_role"
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "rds.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
})
}

resource "aws_iam_policy" "rds_policy" {
  name = "rds_policy"
  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DecryptSecretValue",
            "Effect": "Allow",
            "Action": "kms:Decrypt",
            "Resource": "arn:aws:kms:eu-central-1:048479317518:key/4738fc3c-c62e-46ba-aaa4-dbb60154a378",
            "Condition": {
                "StringEquals": {
                    "kms:ViaService": "secretsmanager.eu-central-1.amazonaws.com"
                }
            }
        },
        {
            "Sid": "GetSecretValue",
            "Effect": "Allow",
            "Action": "secretsmanager:GetSecretValue",
            "Resource": "${var.secret_manager_arn}"
        }
    ]
})
}

resource "aws_iam_role_policy_attachment" "rds_policy_attachment" {
  policy_arn = aws_iam_policy.rds_policy.arn
  role       = aws_iam_role.rds_role.name
}
