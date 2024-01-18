resource "aws_db_instance" "default" {
  identifier = "abschlussprojekt-db"
  allocated_storage    = 10
  db_name              = "techstarter"
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t2.micro"
  username             = "admin"
  password             = "admin0123"
  parameter_group_name = "default.mysql5.7"
  skip_final_snapshot  = true
  publicly_accessible   = true
}

resource "aws_db_proxy" "proxy" {
  name                   = "rds_proxy"
  debug_logging          = false
  engine_family          = "MYSQL"
  idle_client_timeout    = 1800
  require_tls            = false
  role_arn               = aws_iam_role.example.arn
  vpc_security_group_ids = [aws_security_group.example.id]
  vpc_subnet_ids         = [aws_subnet.example.id]

  auth {
    auth_scheme = "SECRETS"
    description = "example"
    iam_auth    = "DISABLED"
    secret_arn  = aws_secretsmanager_secret.secret.arn
  }

  tags = {
    Name = "example"
    Key  = "value"
  }
}

resource "aws_db_proxy_default_target_group" "proxy_tg" {
  db_proxy_name = aws_db_proxy.proxy.name

  connection_pool_config {
    connection_borrow_timeout    = 120
    init_query                   = "SET x=1, y=2"
    max_connections_percent      = 100
    max_idle_connections_percent = 50
    session_pinning_filters      = ["EXCLUDE_VARIABLE_SETS"]
  }
}

resource "aws_db_proxy_target" "example" {
  db_instance_identifier = aws_db_instance.default.identifier
  db_proxy_name          = aws_db_proxy.proxy.name
  target_group_name      = aws_db_proxy_default_target_group.proxy_tg.name
}

resource "aws_secretsmanager_secret" "secret" {
  name = "secret"
}