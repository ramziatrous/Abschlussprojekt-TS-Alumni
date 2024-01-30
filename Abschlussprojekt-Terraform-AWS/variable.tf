variable "key_name" {
  type = string
  default = "SSH-Abschlussproject"
}

variable "subnets_cidr" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "availability_zones" {
  type    = list(string)
  default = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
}
# variable "docker_pass" {
  
# }
