import { Customer } from './entities/customer.entity';
import { Controller } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  validation: false,
  model: {
    type: Customer,
  },
  params: {
    id: {
      field: 'id',
      primary: true,
      type: 'string',
    },
  },
})
@Controller('customers')
export class CustomersController implements CrudController<Customer> {
  constructor(public service: CustomersService) {}
}
