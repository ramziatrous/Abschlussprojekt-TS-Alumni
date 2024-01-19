resource "aws_vpc" "project_vpc" {
  cidr_block = var.cidr
  enable_dns_hostnames = true

  tags = {
    Name = var.name
  }
}