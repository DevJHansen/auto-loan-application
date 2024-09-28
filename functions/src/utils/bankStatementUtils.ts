import { google } from '@google-cloud/documentai/build/protos/protos';
import { parseMoneyText, removeEscapedCharacters } from './parsingUtils';
import { ParsedBankStatement, TableItem } from '../types/extraction';

export const parseBankStatementResponse = (
  entities: google.cloud.documentai.v1.Document.IEntity[]
): ParsedBankStatement => {
  const openingBalanceRes = entities.filter(
    (entity) => entity.type === 'opening_balance'
  )[0];
  const closingBalanceRes = entities.filter(
    (entity) => entity.type === 'closing_balance'
  )[0];
  const statementStartDateRes = entities.filter(
    (entity) => entity.type === 'statement_start_date'
  )[0];
  const statementEndDateRes = entities.filter(
    (entity) => entity.type === 'statement_end_date'
  )[0];
  const tableItemsRes = entities.filter(
    (entity) => entity.type === 'table_item'
  );

  const tableItems: TableItem[] = tableItemsRes.map((item) => {
    const date =
      item.properties?.filter((prop) => prop.type === 'date')[0]
        ?.normalizedValue?.text ?? '';

    const description = removeEscapedCharacters(
      item.properties?.filter((prop) => prop.type === 'description')[0]
        ?.mentionText ?? ''
    );

    const incomeValue =
      item.properties?.filter((prop) => prop.type === 'income')[0]
        ?.normalizedValue?.text ??
      item.properties?.filter((prop) => prop.type === 'income')[0]?.mentionText;

    const income = parseMoneyText(incomeValue ?? '0');

    const expenseValue =
      item.properties?.filter((prop) => prop.type === 'expense')[0]
        ?.normalizedValue?.text ??
      item.properties?.filter((prop) => prop.type === 'expense')[0]
        ?.mentionText;

    const expense = parseMoneyText(expenseValue ?? '0');

    return {
      date,
      description,
      income,
      expense,
    };
  });

  return {
    openingBalance: {
      amount: parseMoneyText(openingBalanceRes?.mentionText ?? '0'),
      confidence: openingBalanceRes.confidence ?? 0,
    },
    closingBalance: {
      amount: parseMoneyText(closingBalanceRes?.mentionText ?? '0'),
      confidence: closingBalanceRes.confidence ?? 0,
    },
    statementStartDate: {
      date: statementStartDateRes?.normalizedValue?.text ?? '',
      confidence: statementStartDateRes.confidence ?? 0,
    },
    statementEndDate: {
      date: statementEndDateRes?.normalizedValue?.text ?? '',
      confidence: statementEndDateRes.confidence ?? 0,
    },
    tableItems,
  };
};
