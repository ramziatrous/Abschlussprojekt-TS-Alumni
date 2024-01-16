data "aws_s3_bucket_object" "config" {
  bucket = "TF-stat"
  key = "lambdi.json"
}