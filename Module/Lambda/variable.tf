
variable "lamda_obj" {
  type = any
  default = {
     
      function_name = "AddItem"
      http_Methode   = "POST"
      route         = "/default"

    
  }
}

variable "role_arn" {

}
variable "api_execution_arn" {

}
