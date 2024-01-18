terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "tfstate-bucket-abschlussproject"
    key    = "abschlussproject/terraform.tfstate"
    region = "eu-central-1"
    dynamodb_table = "tfstate-table"
  }
}
provider "aws" {
  profile = "default"
  region  = "eu-central-1"
}
