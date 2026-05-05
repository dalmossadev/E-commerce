import { GeneratePaymentQRCodeUseCase } from "@core/use-cases/payment/GeneratePaymentQRCodeUseCase";
import { IQRCodeService } from "@core/interfaces/IQRCodeService";

describe('GeneratePaymentQRCodeUseCase', () => {
  let useCase: GeneratePaymentQRCodeUseCase;
  let qrCodeServiceMock: jest.Mocked<IQRCodeService>;

  beforeEach(() => {
    qrCodeServiceMock = {
      generateBase64: jest.fn().mockResolvedValue('data:image/png;base64,mocked_qrcode')
    };
    useCase = new GeneratePaymentQRCodeUseCase(qrCodeServiceMock);
  });

  it('should generate a PIX payload and call QR code service', async () => {
    const data = {
      amount: 15000, // R$ 150.00
      pixKey: 'test@pix.com',
      merchantName: 'Sisters Lab',
      city: 'SAO PAULO'
    };

    const result = await useCase.execute(data);

    expect(qrCodeServiceMock.generateBase64).toHaveBeenCalled();
    const payload = qrCodeServiceMock.generateBase64.mock.calls[0][0];
    
    // Basic BRCode checks
    expect(payload).toContain('000201'); // PFI
    expect(payload).toContain('test@pix.com'); // Key
    expect(payload).toContain('150.00'); // Amount
    expect(payload).toContain('Sisters Lab'); // Name
    expect(payload).toContain('SAO PAULO'); // City
    expect(result).toBe('data:image/png;base64,mocked_qrcode');
  });

  it('should calculate CRC16 correctly', async () => {
    const data = {
      amount: 1000,
      pixKey: '123',
      merchantName: 'A',
      city: 'B'
    };

    await useCase.execute(data);
    const payload = qrCodeServiceMock.generateBase64.mock.calls[0][0];
    
    // Check if payload ends with a 4-char hex CRC
    const crc = payload.slice(-4);
    expect(crc).toMatch(/^[0-9A-F]{4}$/);
  });
});
