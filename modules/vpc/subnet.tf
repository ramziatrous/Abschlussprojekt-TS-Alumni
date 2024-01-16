resource "aws_subnet" "project_subnet" {
  count                   = length(var.subnets_cidr)
  vpc_id                  = aws_vpc.project_vpc.id
  cidr_block              = var.subnets_cidr[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = var.map_public_ip_on_launch

  tags = {
    Name = "Subnet ${var.availability_zones[count.index]}"
  }
}
