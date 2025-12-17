resource "aws_ecr_repository" "catalog_service" {
    name = "catalog-service"

    image_scanning_configuration {
        scan_on_push = true
    }
    image_tag_mutability = "MUTABLE"

    tags = {
        Name = "catalog-service"
        project = var.project_name
    }
}

resource "aws_ecr_repository" "api_gateway" {
    name = "api-gateway"

    image_scanning_configuration {
        scan_on_push = true
    }

    image_tag_mutability = "MUTABLE"

    tags = {
        Name = "api-gateway"
        project = var.project_name
    }
}