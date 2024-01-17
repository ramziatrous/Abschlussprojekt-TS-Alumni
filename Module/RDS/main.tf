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