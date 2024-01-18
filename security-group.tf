module "sg_module" {
  source = "./modules/security-group"
  
  vpc_id = module.vpc_module.vpc_id
}
