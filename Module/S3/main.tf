resource "aws_s3_bucket" "backend" {
  bucket        = "tf-backend-abschlussprojekt"
  force_destroy = true
  tags = {
    Name = "My bucket"
  }
}

resource "aws_s3_bucket_policy" "backend" {
  bucket = aws_s3_bucket.backend.id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : ["s3:GetObject", "s3:PutObject"],
        "Resource" : "${aws_s3_bucket.backend.arn}/*",
        "Principal" : "*"
      }

    ]
    }

  )
  depends_on = [aws_s3_bucket.backend,aws_s3_bucket_public_access_block.backend]
}

resource "aws_s3_bucket_public_access_block" "backend" {
  bucket = aws_s3_bucket.backend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}