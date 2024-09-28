import { google } from '@google-cloud/documentai/build/protos/protos';
import { ParsedPayslip, MondayTableValue } from '../types/extraction';
import { parseMoneyText } from './parsingUtils';

export const parsePayslipResponse = (
  entities: google.cloud.documentai.v1.Document.IEntity[]
): ParsedPayslip => {
  const netPay = entities.filter((entity) => entity.type === 'net_pay');
  const payDate = entities.filter((entity) => entity.type === 'pay_date');
  const deductionResults = entities.filter(
    (entity) => entity.type === 'deduction_item'
  );
  const earningsResults = entities.filter(
    (entity) => entity.type === 'income_item'
  );

  const deductions: MondayTableValue[] = deductionResults.map((deduction) => {
    const description =
      deduction.properties?.filter((prop) => prop.type === 'description')[0]
        ?.mentionText ?? '';

    const amountValue =
      deduction.properties?.filter((prop) => prop.type === 'amount')[0]
        ?.normalizedValue?.text ??
      deduction.properties?.filter((prop) => prop.type === 'amount')[0]
        ?.mentionText;

    const amount = parseMoneyText(amountValue ?? '0');

    return {
      confidence: deduction.confidence ?? 0,
      amount,
      description,
    };
  });

  const earnings: MondayTableValue[] = earningsResults.map((earning) => {
    const description =
      earning.properties?.filter((prop) => prop.type === 'description')[0]
        ?.mentionText ?? '';

    const amountValue =
      earning.properties?.filter((prop) => prop.type === 'amount')[0]
        ?.normalizedValue?.text ??
      earning.properties?.filter((prop) => prop.type === 'amount')[0]
        ?.mentionText;

    const amount = parseMoneyText(amountValue ?? '0');

    return {
      confidence: earning.confidence ?? 0,
      amount,
      description,
    };
  });

  return {
    netPay: {
      amount: parseMoneyText(netPay[0]?.normalizedValue?.text ?? '0'),
      confidence: netPay[0]?.confidence ?? 0,
    },
    payDate: {
      date: payDate[0]?.normalizedValue?.text ?? '',
      confidence: payDate[0]?.confidence ?? 0,
    },
    deductions,
    earnings,
  };
};
