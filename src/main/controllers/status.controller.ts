import { Request, Response } from 'express';
import { DBClient } from 'main/db';
import { Controller, Get } from 'resdk';

@Controller('/_status')
export class StatusController {
  @Get('/health')
  private async health(req: Request, res: Response) {
    await DBClient.shared.defaultQuestion.createMany({
      data: [
        {
          criteria: 'ROE',
          question: 'ROE historicamente maior que 5%? (Considere anos anteriores).',
          strategy: 'stock',
        },
        {
          criteria: 'DÍVIDA LÍQUIDA - LUCRO LÍQUIDO',
          question: 'A dívida líquida da empresa é menor que o lucro líquido dos últimos 12 meses?',
          strategy: 'stock',
        },
        {
          criteria: 'CAGR',
          question: 'Tem um crescimento de receitas (Ou lucro) superior a 5% nos últimos 5 anos?',
          strategy: 'stock',
        },
        {
          criteria: 'DIVIDENDOS',
          question: 'A empresa tem um histórico de pagamento de dividendos nos últimos 5 anos?',
          strategy: 'stock',
        },
        {
          criteria: 'TECNOLOGIA E PESQUISA',
          question:
            'A empresa investe amplamente em pesquisa e inovação? Setor Obsoleto = SEMPRE NÃO',
          strategy: 'stock',
        },
        {
          criteria: 'P/VP',
          question: 'A empresa está negociada com um P/VP abaixo de 3?',
          strategy: 'stock',
        },
        {
          criteria: 'LUCRO OPERACIONAL',
          question: 'A empresa teve lucro operacional no último exercício?',
          strategy: 'stock',
        },
        {
          criteria: 'TEMPO DE MERCADO',
          question: 'Tem mais de 30 anos de mercado? (Fundação)',
          strategy: 'stock',
        },
        {
          criteria: 'VANTAGENS COMPETITIVAS',
          question:
            'É líder nacional ou mundial no setor em que atua? (Só considera se for LÍDER, primeira colocada)',
          strategy: 'stock',
        },
        {
          criteria: 'PERENIDADE',
          question: 'O setor em que a empresa atua tem mais de 100 anos?',
          strategy: 'stock',
        },
        {
          criteria: 'TAMANHO',
          question: 'A empresa é uma BLUE CHIP?',
          strategy: 'stock',
        },
        {
          criteria: 'GOVERNANÇA',
          question: 'A empresa tem uma boa gestão? Histórico de corrupção = SEMPRE NÃO',
          strategy: 'stock',
        },
        {
          criteria: 'INDEPENDÊNCIA',
          question: 'É livre de controle ESTATAL ou concentração em cliente único?',
          strategy: 'stock',
        },
        {
          criteria: 'P/L',
          question: 'O Preço/Lucro da empresa está abaixo de 15?',
          strategy: 'stock',
        },
        {
          criteria: 'ENDIVIDAMENTO',
          question: 'Div. Líquida/EBITDA é menor que 2 nos últimos 5 anos?',
          strategy: 'stock',
        },
      ],
    });
    res.json({ status: 'OK' });
  }
}
