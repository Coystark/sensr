import { Product } from './entities/product.entity';
import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  validation: false,
  model: {
    type: Product,
  },
  params: {
    id: {
      field: 'id',
      primary: true,
      type: 'string',
    },
  },
})
@Controller('products')
export class ProductsController implements CrudController<Product> {
  constructor(public service: ProductsService) {}
}
