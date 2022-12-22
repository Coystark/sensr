import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService extends TypeOrmCrudService<Customer> {
  constructor(@InjectRepository(Customer) repo) {
    super(repo);
  }

  async createOne(req: CrudRequest, dto: any) {
    const emailExists = await this.repo.findOne({
      where: { email: dto.email },
    });

    if (emailExists) {
      throw new UnauthorizedException(
        'Cliente já foi registrado. Por favor, forneça um email diferente.',
      );
    }

    const response = await super.createOne(req, dto);
    return response;
  }
}
