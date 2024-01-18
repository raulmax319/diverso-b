import crypto from 'crypto';

export class Crypton {
  private accept: string = this.sign();
  static shared = new Crypton();
  private constructor() {}

  public sign(): string {
    return crypto
      .createHmac('sha512', process.env.CRYPTO_SECRET)
      .update(Buffer.from(process.env.CRYPTO_PAYLOAD))
      .digest('base64');
  }

  public verify(a: string): boolean {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(this.accept));
  }
}
