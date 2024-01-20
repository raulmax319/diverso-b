import createHttpError from 'http-errors';
import { Asset, Symbol, YFinance } from 'domain/models';
import { Service } from 'domain/service';
import { DBClient } from 'main/db';
import { HttpClient } from 'src/data/protocols/http';
import { AxiosHttpClient } from 'src/infra/http';

export class AssetsService extends Service {
  private crumb: string;
  constructor(private readonly httpClient: HttpClient = new AxiosHttpClient()) {
    super();
  }

  private async fetchCrumb(): Promise<string> {
    try {
      if (!this.httpClient.headers?.Cookie) {
        await this.httpClient.get<never, never>({
          url: 'https://finance.yahoo.com/',
        });
      }

      const result = await this.httpClient.get<never, string>({
        url: 'https://query1.finance.yahoo.com/v1/test/getcrumb',
      });

      return result.body;
    } catch (error) {
      this.logger.error(error);
      createHttpError.BadRequest(error);
    }
  }

  private async fetchSymbols(query: string): Promise<Array<Symbol>> {
    try {
      if (!this.crumb) {
        this.crumb = await this.fetchCrumb();
      }

      const corsDomain = 'corsDomain=finance.yahoo.com&.tsrc=finance';
      const response = await this.httpClient.get<never, YFinance>({
        url: `${process.env.BASE_FINANCE_URI}/quote?&crumb=${this.crumb}&symbols=${query}&${corsDomain}`,
      });

      const result = response.body as YFinance;
      return result.quoteResponse.result.map((quote) => ({
        symbol: quote.symbol,
        currency: quote.currency,
        regularMarketPreviousClose: quote.regularMarketPreviousClose,
        regularMarketPrice: quote.regularMarketPrice,
        longName: quote.longName,
      }));
    } catch (error) {
      this.logger.error(error);
      createHttpError.BadRequest(error);
    }
  }

  public async create(asset: Asset, userId: string): Promise<Asset> {
    const data = {
      type: asset.type,
      ticker: asset.ticker,
      quantity: asset.quantity,
      userId,
    };

    return await DBClient.shared.asset.create({
      data,
    });
  }

  public async createMany(assets: Array<Asset>, userId: string): Promise<number> {
    const result = await DBClient.shared.asset.createMany({
      data: assets.map((asset) => ({ ...asset, userId })),
    });
    return result.count;
  }

  public async findAllByUserId(userId: string): Promise<Array<Asset>> {
    try {
      if (!userId) throw createHttpError.NotFound('User not found.');
      await this.fetchCrumb();

      const questions = await DBClient.shared.question.findMany({
        where: { userId },
      });

      const result = await DBClient.shared.asset.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          type: true,
          ticker: true,
          quantity: true,
          questions: true,
        },
      });

      const assets = result.map((asset) => ({
        ...asset,
        score: questions.filter((q) => asset.questions.find((question) => q.id === question))
          .length,
      }));

      const currencies = 'BRL=X,JPYBRL=X,EURBRL=X';
      const tickers = assets
        .filter((asset) => asset.type !== 'valueReserve' && asset.type !== 'fixedIncome')
        .map((a) => {
          if (a.type === 'national' || a.type === 'fii') return `${a.ticker}.SA`;
          else if (a.type === 'crypto') return `${a.ticker}-USD`;
          else return a.ticker;
        });

      const symbols = await this.fetchSymbols(`${currencies},${tickers.join(',')}`);

      return assets.map((ass) => {
        if (ass.type === 'fixedIncome')
          return {
            ...ass,
            currentPrice: 3270,
            position: 3270,
          };

        const symbol = symbols.find((s) => {
          if (ass.type === 'national' || ass.type === 'fii') {
            const [ticker, suffix] = s.symbol.split('.');

            if (suffix === 'SA' && ass.ticker === ticker) {
              return {
                ...s,
                symbol: ticker,
              };
            }
          }

          if (ass.type === 'crypto') {
            const [crypto] = s.symbol.split('-');

            if (ass.ticker === crypto) {
              return {
                ...s,
                symbol: crypto,
              };
            }
          }

          return ass.ticker === s.symbol;
        });

        const usd = symbols.find((s) => s.symbol === 'BRL=X');
        const jpy = symbols.find((s) => s.symbol === 'JPYBRL=X');
        const eur = symbols.find((s) => s.symbol === 'EURBRL=X');
        let position: number = symbol.regularMarketPrice * ass.quantity;
        let currentPrice: number = symbol.regularMarketPrice;

        if (symbol.currency === 'USD') {
          currentPrice = symbol.regularMarketPrice * usd.regularMarketPreviousClose;
          position = currentPrice * ass.quantity;
        }

        if (symbol.currency === 'JPY') {
          currentPrice = symbol.regularMarketPrice * jpy.regularMarketPreviousClose;
          position = currentPrice * ass.quantity;
        }

        if (symbol.currency === 'EUR') {
          currentPrice = symbol.regularMarketPrice * eur.regularMarketPreviousClose;
          position = currentPrice * ass.quantity;
        }

        return {
          ...ass,
          currentPrice,
          position,
        };
      });
    } catch (error) {
      this.logger.error(error);
      createHttpError.BadRequest(error);
    }
  }

  public async update(data: Asset, userId: string): Promise<Asset> {
    const result = await DBClient.shared.asset.update({
      where: { id: data.id, userId },
      data,
    });
    delete result.userId;
    return result;
  }

  public async delete(id: string, userId: string): Promise<Asset> {
    return await DBClient.shared.asset.delete({ where: { id, userId } });
  }
}
