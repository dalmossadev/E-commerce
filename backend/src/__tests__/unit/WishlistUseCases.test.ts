import { AddProductToWishlistUseCase, RemoveProductFromWishlistUseCase, GetUserWishlistUseCase } from "../../core/use-cases/wishlist/WishlistUseCases";
import { NotFoundError } from "../../core/errors/CustomErrors";

describe("Wishlist Use Cases", () => {
  let mockWishlistRepo: any;
  let mockProductRepo: any;
  let mockUserRepo: any;

  beforeEach(() => {
    mockWishlistRepo = {
      findByUserAndProduct: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByUserId: jest.fn(),
    };
    mockProductRepo = {
      findById: jest.fn(),
    };
    mockUserRepo = {
      findById: jest.fn(),
    };
  });

  describe("AddProductToWishlistUseCase", () => {
    it("deve adicionar produto à wishlist com sucesso", async () => {
      const user = { id: 1, name: "Dalmo" };
      const product = { id: 100, name: "Tênis" };
      const wishlist = { id: 1, userId: 1, productId: 100 };

      mockUserRepo.findById.mockResolvedValue(user);
      mockProductRepo.findById.mockResolvedValue(product);
      mockWishlistRepo.findByUserAndProduct.mockResolvedValue(null);
      mockWishlistRepo.save.mockResolvedValue(wishlist);

      const useCase = new AddProductToWishlistUseCase(
        mockWishlistRepo,
        mockProductRepo,
        mockUserRepo
      );

      const result = await useCase.execute(1, 100);

      expect(result).toEqual(wishlist);
      expect(mockWishlistRepo.save).toHaveBeenCalled();
    });

    it("deve retornar item existente se já estiver na wishlist", async () => {
      const existing = { id: 1, userId: 1, productId: 100 };

      mockUserRepo.findById.mockResolvedValue({ id: 1 });
      mockProductRepo.findById.mockResolvedValue({ id: 100 });
      mockWishlistRepo.findByUserAndProduct.mockResolvedValue(existing);

      const useCase = new AddProductToWishlistUseCase(
        mockWishlistRepo,
        mockProductRepo,
        mockUserRepo
      );

      const result = await useCase.execute(1, 100);

      expect(result).toEqual(existing);
      expect(mockWishlistRepo.save).not.toHaveBeenCalled();
    });

    it("deve lançar NotFoundError se usuário não existir", async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      const useCase = new AddProductToWishlistUseCase(
        mockWishlistRepo,
        mockProductRepo,
        mockUserRepo
      );

      await expect(useCase.execute(999, 100)).rejects.toThrow(NotFoundError);
    });

    it("deve lançar NotFoundError se produto não existir", async () => {
      mockUserRepo.findById.mockResolvedValue({ id: 1 });
      mockProductRepo.findById.mockResolvedValue(null);

      const useCase = new AddProductToWishlistUseCase(
        mockWishlistRepo,
        mockProductRepo,
        mockUserRepo
      );

      await expect(useCase.execute(1, 999)).rejects.toThrow(NotFoundError);
    });
  });

  describe("RemoveProductFromWishlistUseCase", () => {
    it("deve remover item da wishlist com sucesso", async () => {
      const existing = { id: 1, userId: 1, productId: 100 };
      mockWishlistRepo.findByUserAndProduct.mockResolvedValue(existing);
      mockWishlistRepo.delete.mockResolvedValue(undefined);

      const useCase = new RemoveProductFromWishlistUseCase(mockWishlistRepo);
      await useCase.execute(1, 100);

      expect(mockWishlistRepo.delete).toHaveBeenCalledWith(1);
    });

    it("deve lançar NotFoundError se item não existir", async () => {
      mockWishlistRepo.findByUserAndProduct.mockResolvedValue(null);

      const useCase = new RemoveProductFromWishlistUseCase(mockWishlistRepo);

      await expect(useCase.execute(1, 999)).rejects.toThrow(NotFoundError);
    });
  });

  describe("GetUserWishlistUseCase", () => {
    it("deve retornar wishlist do usuário", async () => {
      const items = [
        { id: 1, userId: 1, productId: 100 },
        { id: 2, userId: 1, productId: 200 },
      ];
      mockWishlistRepo.findByUserId.mockResolvedValue(items);

      const useCase = new GetUserWishlistUseCase(mockWishlistRepo);
      const result = await useCase.execute(1);

      expect(result).toEqual(items);
      expect(mockWishlistRepo.findByUserId).toHaveBeenCalledWith(1);
    });

    it("deve retornar array vazio se usuário não tiver itens", async () => {
      mockWishlistRepo.findByUserId.mockResolvedValue([]);

      const useCase = new GetUserWishlistUseCase(mockWishlistRepo);
      const result = await useCase.execute(1);

      expect(result).toEqual([]);
    });
  });
});
