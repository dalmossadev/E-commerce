export interface IQRCodeService {
  generateBase64(data: string): Promise<string>;
}