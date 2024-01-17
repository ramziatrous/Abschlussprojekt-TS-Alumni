data "aws_s3_bucket_object" "config" {
  bucket = "tf-state-ap"
  key    = "lambdi.json"
}