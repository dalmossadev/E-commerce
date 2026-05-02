import { ListCustomersUseCase } from '@core/use-cases/customers/CustomerUseCases';
import { ICustomerRepository } from '@core/interfaces/ICustomerRepository';
import { Customer } from '@core/domain/Customer';

jest.mock('@core/interfaces/ICustomerRepository');

describe('ListCustomersUseCase', () => {
  let useCase: ListCustomersUseCase;
  let mockRepo: jest.Mocked<ICustomerRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCpf: jest.fn()
    } as jest.Mocked<ICustomerRepository>;

    useCase = new ListCustomersUseCase(mockRepo);
  });

  it('should list all customers', async () => {
    const customers = [
      { id: 1, fullName: 'John Doe', cpf: '12345678901', phone: '11999999999', address: {} },
      { id: 2, fullName: 'Jane Doe', cpf: '98765432109', phone: '11888888888', address: {} }
    ];
    mockRepo.findAll.mockResolvedValue(customers);

    const result = await useCase.execute();

    expect(result).toEqual(customers);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no customers exist', async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
