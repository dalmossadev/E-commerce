import { Request, Response } from 'express';
import { CreateCustomerUseCase } from '@core/use-cases/customers/CreateCustomerUseCase';
import { ListCustomersUseCase } from '@core/use-cases/customers/ListCustomersUseCase';
import { GetCustomerByIdUseCase } from '@core/use-cases/customers/GetCustomerByIdUseCase';
import { UpdateCustomerUseCase } from '@core/use-cases/customers/UpdateCustomerUseCase';
import { DeleteCustomerUseCase } from '@core/use-cases/customers/DeleteCustomerUseCase';
import { CustomerQueryDTO } from '@core/dto/CustomerDTO';

export class CustomerController {
  constructor(
    private createCustomerUseCase: CreateCustomerUseCase,
    private listCustomersUseCase: ListCustomersUseCase,
    private getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private updateCustomerUseCase: UpdateCustomerUseCase,
    private deleteCustomerUseCase: DeleteCustomerUseCase
  ) {}

  async create(req: Request, res: Response) {
    try {
      const customer = await this.createCustomerUseCase.execute(req.body);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const query: CustomerQueryDTO = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search as string,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC'
      };
      const result = await this.listCustomersUseCase.execute(query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const customer = await this.getCustomerByIdUseCase.execute(Number(req.params.id));
      res.json(customer);
    } catch (error) {
      res.status(404).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const customer = await this.updateCustomerUseCase.execute(Number(req.params.id), req.body);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.deleteCustomerUseCase.execute(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
