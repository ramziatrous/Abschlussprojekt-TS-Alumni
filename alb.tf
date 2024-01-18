module "alb_module" {
  source          = "./modules/alb"
  vpc_id          = module.vpc_module.vpc_id
  subnets         = module.vpc_module.subnet_ids
  security_groups = module.sg_module.security_group_ids
}
