variable "project_name" {
    description = "The name of the project."
    type        = string
    default = "netflix"
  
}

variable "region" {
    description = "The AWS region to deploy resources in."
    type        = string
    default     = "us-east-1"
  
}
variable "vpc_cidr" {
    description = "The CIDR block for the VPC."
    type        = string
    default     = "10.0.0.0/16"
  
}
variable "tmdb_api_key" {
  description = "TMDB API Key"
  type        = string
  sensitive   = true
}

