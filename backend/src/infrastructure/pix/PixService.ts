import QRCode from 'qrcode';

export interface PixPayloadParams {
  key: string;
  name: string;
  city: string;
  amount: number; // in cents
  orderId: string | number;
}

export class PixService {
  /**
   * Generates a BR Code (EMV) valid for PIX.
   */
  static generatePixPayload({ key, name, city, amount, orderId }: PixPayloadParams): string {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    const formatLength = (value: string) => value.length.toString().padStart(2, '0');

    const payloadFormatIndicator = '000201';
    
    // Merchant Account Information (PIX)
    const pixGuid = '0014br.gov.bcb.pix';
    const pixKey = `01${formatLength(key)}${key}`;
    const merchantAccountInformation = `26${formatLength(pixGuid + pixKey)}${pixGuid}${pixKey}`;

    // Merchant Category Code (0000 = not specified)
    const merchantCategoryCode = '52040000';
    
    // Transaction Currency (986 = BRL)
    const transactionCurrency = '5303986';
    
    // Transaction Amount
    const amountInReais = amount / 100;
    const amountString = amountInReais.toFixed(2);
    const transactionAmount = `54${formatLength(amountString)}${amountString}`;
    
    // Country Code (BR)
    const countryCode = '5802BR';
    
    // Merchant Name
    const merchantName = `59${formatLength(name)}${name}`;
    
    // Merchant City
    const merchantCity = `60${formatLength(city)}${city}`;
    
    // Additional Data Field Template
    const txid = `ORDER${orderId}`;
    const txidField = `05${formatLength(txid)}${txid}`;
    const additionalDataField = `62${formatLength(txidField)}${txidField}`;

    // Combine payload before CRC
    const payload = [
      payloadFormatIndicator,
      merchantAccountInformation,
      merchantCategoryCode,
      transactionCurrency,
      transactionAmount,
      countryCode,
      merchantName,
      merchantCity,
      additionalDataField,
      '6304' // CRC16 format indicator
    ].join('');

    // Calculate CRC16 CCITT
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc = crc << 1;
        }
      }
    }
    const crcString = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');

    return payload + crcString;
  }

  /**
   * Generates a base64 QR Code image from a string payload.
   */
  static async generatePixQRCode(payload: string): Promise<string> {
    try {
      const qrCodeBase64 = await QRCode.toDataURL(payload);
      return qrCodeBase64;
    } catch (error) {
      throw new Error('Failed to generate PIX QRCode');
    }
  }
}
