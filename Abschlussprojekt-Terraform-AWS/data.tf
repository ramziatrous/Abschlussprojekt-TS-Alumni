data "aws_s3_bucket_object" "config" {
  bucket = "tfstate-bucket-abschlussproject"
  key    = "lambdi.json"
}