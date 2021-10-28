import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

export class PostgresConfiguration implements TypeOrmOptionsFactory{
    createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions>{
        const options:TypeOrmModuleOptions={
            type:'postgres',
            host:'localhost',
            port:5432,
            username:'postgres',
            password:'123456',
            database:'linkedin',
            entities:[__dirname+'/../**/*.entity{.ts,.js}'],
            synchronize:true
        }
        return options
    }
}