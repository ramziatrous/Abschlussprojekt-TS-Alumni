resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.project_vpc.id

  tags = {
    Name = "Internet Gateway"
  }
}