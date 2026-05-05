// src/infrastructure/services/QRCodeService.ts
import QRCode from 'qrcode';
import { IQRCodeService } from '../../core/interfaces/IQRCodeService';
import { logger } from '../logger/logger';

export class QRCodeService implements IQRCodeService {
  /**
   * Gera um QR Code em formato Data URL (Base64)
   * Ideal para ser consumido diretamente pela tag <img> no frontend do SHOP VAREJO.
   */
  async generateBase64(data: string): Promise<string> {
    try {
      // Configuramos margem e escala para melhor leitura no mobile
      const options: QRCode.QRCodeToDataURLOptions = {
        errorCorrectionLevel: 'M', // Médio: equilíbrio entre densidade e leitura
        margin: 2,
        scale: 4,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      };

      const qrCodeBase64 = await QRCode.toDataURL(data, options);
      
      return qrCodeBase64;
    } catch (error: any) {
      logger.error(`[QRCodeService] Falha ao gerar código: ${error.message}`);
      throw new Error('Não foi possível gerar o código de pagamento.');
    }
  }
}
