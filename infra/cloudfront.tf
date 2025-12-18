resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name              = "netflix-frontend-fardeen.s3.us-east-1.amazonaws.com"
    origin_id                = "netflix-frontend-fardeen.s3.us-east-1.amazonaws.com-mj8ba2quaiu"
    origin_access_control_id = "E168FSIX317N7W" # Hardcoded from existing
    connection_attempts      = 3
    connection_timeout       = 10

    s3_origin_config {
      origin_access_identity = ""
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "" # It seems empty in the JSON, but usually is index.html. Trying empty first.
  price_class         = "PriceClass_All"

  origin {
    domain_name              = aws_alb.my-project.dns_name
    origin_id                = "ALB-${var.project_name}"
    
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "ALB-${var.project_name}"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    
    # Managed-CachingDisabled
    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    # Managed-AllViewer
    origin_request_policy_id = "216adef6-5c7f-47e4-b989-5492eafa07d3"
  }

  ordered_cache_behavior {
    path_pattern     = "/catalog/*"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "ALB-${var.project_name}"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    # Managed-CachingDisabled
    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    # Managed-AllViewer
    origin_request_policy_id = "216adef6-5c7f-47e4-b989-5492eafa07d3"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "netflix-frontend-fardeen.s3.us-east-1.amazonaws.com-mj8ba2quaiu"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    
    # Managed-CachingOptimized
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  web_acl_id = "arn:aws:wafv2:us-east-1:663789292765:global/webacl/CreatedByCloudFront-34986975/b94844e7-0a6a-4a06-b672-aa0d90ebca62"
}
