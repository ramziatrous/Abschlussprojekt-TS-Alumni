resource "aws_db_instance" "default" {
  identifier             = "abschlussprojekt-db"
  allocated_storage      = 20
  db_name                = "TS_AlumniNetwork"
  engine                 = "mysql"
  engine_version         = "5.7"
  instance_class         = "db.t3.micro"
  username               = "admin"
  password               = var.db_password
  parameter_group_name   = "default.mysql5.7"
  skip_final_snapshot    = true
  publicly_accessible    = true
  vpc_security_group_ids = [var.security_group_ids]
  db_subnet_group_name   = aws_db_subnet_group.subnet_group.name

}

resource "aws_db_subnet_group" "subnet_group" {
  name       = "main"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "My DB subnet group"
  }
}
resource "aws_db_proxy" "proxy" {
  name                   = "rdsproxy"
  debug_logging          = false
  engine_family          = "MYSQL"
  idle_client_timeout    = 1800
  require_tls            = false
  role_arn               = var.rds_role_arn
  vpc_security_group_ids = [var.security_group_ids]
  vpc_subnet_ids         = var.subnet_ids

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
    max_connections_percent      = 100
    max_idle_connections_percent = 50
  }
}

resource "aws_db_proxy_target" "example" {
  db_instance_identifier = aws_db_instance.default.identifier
  db_proxy_name          = aws_db_proxy.proxy.name
  target_group_name      = aws_db_proxy_default_target_group.proxy_tg.name
}

resource "aws_secretsmanager_secret" "secret" {
  name = "main"
}
resource "aws_secretsmanager_secret_version" "example" {
  secret_id     = aws_secretsmanager_secret.secret.id
  secret_string = jsonencode({
    engine   = "${aws_db_instance.default.engine}",
    host     = "${aws_db_instance.default.address}",
    username = "${aws_db_instance.default.username}",
    password = "${aws_db_instance.default.password}"
    dbname   = "${aws_db_instance.default.db_name}",
    port     = 3306
  })
}