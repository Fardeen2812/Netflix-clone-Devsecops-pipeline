resource "aws_efs_file_system" "jenkins" {
  creation_token = "jenkins-efs"
  encrypted      = true

  tags = {
    Name = "${var.project_name}-jenkins-efs"
  }
}

resource "aws_efs_mount_target" "jenkins" {
  count           = length(aws_subnet.public_subnet)
  file_system_id  = aws_efs_file_system.jenkins.id
  subnet_id       = aws_subnet.public_subnet[count.index].id
  security_groups = [aws_security_group.efs_sg.id]
}

resource "aws_efs_access_point" "jenkins" {
  file_system_id = aws_efs_file_system.jenkins.id

  posix_user {
    gid = 1000
    uid = 1000
    # Jenkins image usually runs as user 1000
  }

  root_directory {
    path = "/jenkins-home"
    creation_info {
      owner_gid   = 1000
      owner_uid   = 1000
      permissions = "0755"
    }
  }

  tags = {
    Name = "${var.project_name}-jenkins-ap"
  }
}

resource "aws_security_group" "efs_sg" {
  name        = "${var.project_name}-efs-sg"
  description = "Allow NFS traffic from ECS"
  vpc_id      = aws_vpc.my_vpc.id

  ingress {
    from_port       = 2049
    to_port         = 2049
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-efs-sg"
  }
}
