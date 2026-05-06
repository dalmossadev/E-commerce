import { Request, Response, NextFunction } from 'express';
import { GetProductsByRegionUseCase } from '@core/use-cases/product/GetProductsByRegionUseCase';

export class RegionController {
  constructor(
    private getProductsByRegionUseCase: GetProductsByRegionUseCase
  ) {}

  async getProductsByRegion(req: Request, res: Response, next: NextFunction) {
    try {
      const region = req.params.region as string;
      
      if (!region) {
        return res.status(400).json({ message: 'Region parameter is required' });
      }

      const products = await this.getProductsByRegionUseCase.execute(region);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async checkProntaEntrega(req: Request, res: Response, next: NextFunction) {
    try {
      const region = req.params.region as string;
      const sku = req.params.sku as string;
      
      if (!region || !sku) {
        return res.status(400).json({ message: 'Region and SKU parameters are required' });
      }

      const product = await this.getProductsByRegionUseCase.findProductBySku(sku);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const isProntaEntrega = this.getProductsByRegionUseCase.isProntaEntrega(region, product);
      
      res.json({
        sku,
        region,
        isProntaEntrega,
        message: isProntaEntrega 
          ? 'Produto com entrega imediata (Pronta Entrega)' 
          : 'Produto sob consulta (prazo estendido)'
      });
    } catch (error) {
      next(error);
    }
  }
}
