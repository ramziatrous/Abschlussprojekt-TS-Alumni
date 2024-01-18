resource "aws_vpc" "project_vpc" {
  cidr_block = var.cidr

  tags = {
    Name = var.name
  }
}