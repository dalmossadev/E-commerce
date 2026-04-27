import { Request, Response, NextFunction } from 'express';
import { ProductController } from '@adapters/http/controllers/ProductController';

describe('ProductController', () => {
  let controller: ProductController;
  let mockListUseCase: any;
  let mockGetUseCase: any;
  let mockCreateUseCase: any;
  let mockUpdateUseCase: any;
  let mockDeleteUseCase: any;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockListUseCase = {
      execute: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 })
    };
    mockGetUseCase = {
      execute: jest.fn()
    };
    mockCreateUseCase = {
      execute: jest.fn()
    };
    mockUpdateUseCase = {
      execute: jest.fn()
    };
    mockDeleteUseCase = {
      execute: jest.fn()
    };

    controller = new ProductController(
      mockListUseCase,
      mockGetUseCase,
      mockCreateUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase
    );

    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('handle', () => {
    it('should return products with query options', async () => {
      const mockProducts = { data: [{ id: 1 }], total: 1, page: 1, limit: 10, totalPages: 1 };
      mockListUseCase.execute.mockResolvedValue(mockProducts);

      await controller.handle(mockReq as Request, mockRes as Response, mockNext);

      expect(mockListUseCase.execute).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should call next on error', async () => {
      mockListUseCase.execute.mockRejectedValue(new Error('DB Error'));

      await controller.handle(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getBySku', () => {
    it('should return product by SKU', async () => {
      const mockProduct = { id: 1, sku: 'TEST' };
      mockReq.params = { sku: 'TEST' };
      mockGetUseCase.execute.mockResolvedValue(mockProduct);

      await controller.getBySku(mockReq as Request, mockRes as Response, mockNext);

      expect(mockGetUseCase.execute).toHaveBeenCalledWith('TEST');
      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      mockReq.params = { sku: 'NOTFOUND' };
      mockGetUseCase.execute.mockResolvedValue(undefined);

      await controller.getBySku(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const mockProduct = { id: 1, name: 'Test' };
      mockReq.body = { name: 'Test' };
      mockCreateUseCase.execute.mockResolvedValue(mockProduct);

      await controller.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockCreateUseCase.execute).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should call next on error', async () => {
      mockReq.body = { name: 'Test' };
      mockCreateUseCase.execute.mockRejectedValue(new Error('Create Error'));

      await controller.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});