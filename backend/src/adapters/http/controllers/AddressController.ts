import { Request, Response } from "express";
import { CreateAddressUseCase } from "@core/use-cases/address/CreateAddressUseCase";
import { UpdateAddressUseCase } from "@core/use-cases/address/UpdateAddressUseCase";
import { DeleteAddressUseCase } from "@core/use-cases/address/DeleteAddressUseCase";
import { ListAddressesByOwnerUseCase } from "@core/use-cases/address/ListAddressesByOwnerUseCase";
import { SetMainAddressUseCase } from "@core/use-cases/address/SetMainAddressUseCase";

export class AddressController {
  constructor(
    private createAddressUseCase: CreateAddressUseCase,
    private updateAddressUseCase: UpdateAddressUseCase,
    private deleteAddressUseCase: DeleteAddressUseCase,
    private listAddressesByOwnerUseCase: ListAddressesByOwnerUseCase,
    private setMainAddressUseCase: SetMainAddressUseCase
  ) {}

  async create(req: Request, res: Response) {
    try {
      const address = await this.createAddressUseCase.execute(req.body);
      res.status(201).json(address);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Erro ao criar endereço" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const address = await this.updateAddressUseCase.execute(Number(id), req.body);
      res.json(address);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Erro ao atualizar endereço" });
    }
  }

  async listByCustomer(req: Request, res: Response) {
    try {
      const { customerId } = req.params;
      const addresses = await this.listAddressesByOwnerUseCase.execute(Number(customerId), 'CUSTOMER');
      res.json(addresses);
    } catch (error) {
      res.status(400).json({ message: "Erro ao buscar endereços" });
    }
  }

  async listBySupplier(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const addresses = await this.listAddressesByOwnerUseCase.execute(Number(supplierId), 'SUPPLIER');
      res.json(addresses);
    } catch (error) {
      res.status(400).json({ message: "Erro ao buscar endereços" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteAddressUseCase.execute(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Erro ao excluir endereço" });
    }
  }

  async setMain(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { ownerId, ownerType } = req.body;
      await this.setMainAddressUseCase.execute(Number(id), ownerId, ownerType);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Erro ao definir endereço principal" });
    }
  }
}
