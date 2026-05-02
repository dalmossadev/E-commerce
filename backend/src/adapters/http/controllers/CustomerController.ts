import { Request, Response, NextFunction } from 'express';
import { CreateCustomerUseCase, ListCustomersUseCase, GetCustomerByIdUseCase, UpdateCustomerUseCase, DeleteCustomerUseCase } from '@core/use-cases/customers/CustomerUseCases';
import { CreateCustomerDTO, UpdateCustomerDTO, CustomerQueryDTO } from '@core/dto/CustomerDTO';
import { container } from '@core/container/Container';
import { createCustomerSchema, updateCustomerSchema } from '../validations/customer.validation';

const parseId = (param: string | string[]): number | null => {
  const id = parseInt(Array.isArray(param) ? param[0] : param, 10);
  return isNaN(id) ? null : id;
};

export class CustomerController {
  private createCustomerUseCase: CreateCustomerUseCase;
  private listCustomersUseCase: ListCustomersUseCase;
  private getCustomerByIdUseCase: GetCustomerByIdUseCase;
  private updateCustomerUseCase: UpdateCustomerUseCase;
  private deleteCustomerUseCase: DeleteCustomerUseCase;

  constructor() {
    this.createCustomerUseCase = container.createCustomerUseCase();
    this.listCustomersUseCase = container.listCustomersUseCase();
    this.getCustomerByIdUseCase = container.getCustomerByIdUseCase();
    this.updateCustomerUseCase = container.updateCustomerUseCase();
    this.deleteCustomerUseCase = container.deleteCustomerUseCase();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createCustomerSchema.parse(req.body) as CreateCustomerDTO;
      const customer = await this.createCustomerUseCase.execute(data);
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: CustomerQueryDTO = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: req.query.search as string,
        sortBy: req.query.sortBy as any || 'createdAt',
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' || 'DESC'
      };
      const result = await this.listCustomersUseCase.execute(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid customer ID' });
        return;
      }
      const customer = await this.getCustomerByIdUseCase.execute(id);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid customer ID' });
        return;
      }
      const data = updateCustomerSchema.parse(req.body) as UpdateCustomerDTO;
      const customer = await this.updateCustomerUseCase.execute(id, data);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid customer ID' });
        return;
      }
      await this.deleteCustomerUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
