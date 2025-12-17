terraform {
    required_providers {
        aws = {
        source  = "hashicorp/aws"
        version = "~> 5.0"
        }
    }
    backend "s3" {
        bucket         = "my-terraform-state-bucket-fardeen"
        key            = "global/s3/terraform.tfstate"
        region         = "us-east-1"
        dynamodb_table = "terraform-state-lock-fardeen"
        encrypt        = true
      
    }
}

provider "aws" {
    region = "us-east-1"
}