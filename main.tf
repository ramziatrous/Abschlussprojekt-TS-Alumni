terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = var.region
  profile = var.aws_profile
}

module "alb_module" {
  source          = "./modules/alb"
  vpc_id          = module.vpc_module.vpc_id
  subnets         = module.vpc_module.subnet_ids
  security_groups = module.sg_module.security_group_ids
}

module "asg_module" {
  source          = "./modules/asg"
  subnets         = module.vpc_module.subnet_ids
  vpc_id          = module.vpc_module.vpc_id
  security_groups = module.sg_module.security_group_ids
  key_name        = var.key_name
}

module "sg_module" {
  source = "./modules/security-group"
  vpc_id = module.vpc_module.vpc_id
}

module "vpc_module" {
  source                  = "./modules/vpc"
  cidr                    = "10.0.0.0/16"
  name                    = "project_vpc"
  subnets_cidr            = var.subnets_cidr
  availability_zones      = var.availability_zones
  map_public_ip_on_launch = true
}
