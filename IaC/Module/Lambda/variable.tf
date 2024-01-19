
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

variable "db_password" {
  
}
variable "db_host" {
  
}
variable "security_group_ids" {
  
}
variable "subnet_ids" {
  
}