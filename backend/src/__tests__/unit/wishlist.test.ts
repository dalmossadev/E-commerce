import { Wishlist } from "../../core/domain/Wishlist";

describe("Wishlist Domain Entity", () => {
  it("deve criar wishlist com userId e productId", () => {
    const wishlist = new Wishlist({
      userId: 1,
      productId: 100,
    });

    expect(wishlist.userId).toBe(1);
    expect(wishlist.productId).toBe(100);
    expect(wishlist.id).toBeUndefined();
    expect(wishlist.createdAt).toBeInstanceOf(Date);
  });

  it("deve aceitar id e createdAt customizados", () => {
    const date = new Date("2026-04-30");
    const wishlist = new Wishlist({
      id: 5,
      userId: 2,
      productId: 200,
      createdAt: date,
    });

    expect(wishlist.id).toBe(5);
    expect(wishlist.createdAt).toBe(date);
  });

  it("deve aceitar user e product opcionais", () => {
    const wishlist = new Wishlist({
      userId: 1,
      productId: 100,
      user: { id: 1, name: "Dalmo" } as any,
      product: { id: 100, name: "Tênis" } as any,
    });

    expect(wishlist.user).toBeDefined();
    expect(wishlist.product).toBeDefined();
  });
});
