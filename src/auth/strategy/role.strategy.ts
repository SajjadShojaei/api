import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLE_TAG } from "../decorator/role.decorator";
import { User } from "../models/user.class";

@Injectable()
export class RoleStrategy implements CanActivate{
    constructor(
        private readonly reflector:Reflector,

    ){
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles=this.reflector.getAllAndOverride(ROLE_TAG,[
            context.getClass(),
            context.getHandler()
        ])

        if(!roles)
        return true

        const {user}:{user:User}=context.switchToHttp().getRequest()
        const userRole=user.role
        for(let role of roles){
            if(user.role===role)
            return true
        }
        return false;
    }
    
}