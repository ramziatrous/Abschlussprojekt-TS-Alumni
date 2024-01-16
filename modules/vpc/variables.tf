variable "cidr" {
  description = "The CIDR block for the VPC"
  type        = string
}

variable "enable_dns_support" {
  description = "A boolean flag to enable/disable DNS support in the VPC"
  type        = bool
  default     = true
}

variable "enable_dns_hostnames" {
  description = "A boolean flag to enable/disable DNS hostnames in the VPC"
  type        = bool
  default     = true
}

variable "name" {
  description = "The name of the VPC"
  type        = string
}

variable "subnets_cidr" {
  description = "A list of subnet CIDR blocks"
  type        = list(string)
}

variable "availability_zones" {
  description = "A list of availability zones in which to place subnets"
  type        = list(string)
}

variable "map_public_ip_on_launch" {
  description = "Whether to enable auto-assign public IP on subnet"
  type        = bool
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}
