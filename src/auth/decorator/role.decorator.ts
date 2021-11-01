import { SetMetadata } from "@nestjs/common"
import { Role } from "../models/role.enum"

export const ROLE_TAG='role_name'
export const RoleTag=(...roleTag:Role[])=>SetMetadata(ROLE_TAG,roleTag)