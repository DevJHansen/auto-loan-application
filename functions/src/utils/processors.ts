import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { google } from '@google-cloud/documentai/build/protos/protos';
import { parseNamibianIdResponse } from './namibianIdUtils';
import { parsePayslipResponse } from './payslipUtils';
import { parseBankStatementResponse } from './bankStatementUtils';
import {
  BANK_STATEMENT_ID,
  NAMIBIAN_ID_ID,
  PAYSLIP_ID,
} from '../constants/processors';

export const processNamibianId = async (
  client: DocumentProcessorServiceClient,
  uri: string,
  mimeType: string
) => {
  const request: google.cloud.documentai.v1.IProcessRequest = {
    name: NAMIBIAN_ID_ID,
    gcsDocument: {
      gcsUri: uri,
      mimeType,
    },
  };

  try {
    const [result] = await client.processDocument(request);

    if (!result.document?.entities) {
      throw new Error('No entities present processing Namibian Id');
    }

    return parseNamibianIdResponse(result.document.entities);
  } catch (error) {
    const typedError = error as Error;
    console.error(error);
    throw new Error(typedError.message);
  }
};

export const processPayslip = async (
  client: DocumentProcessorServiceClient,
  uri: string,
  mimeType: string
) => {
  const request: google.cloud.documentai.v1.IProcessRequest = {
    name: PAYSLIP_ID,
    gcsDocument: {
      gcsUri: uri,
      mimeType,
    },
  };

  try {
    const [result] = await client.processDocument(request);

    if (!result.document?.entities) {
      throw new Error('No entities present processing payslip');
    }

    return parsePayslipResponse(result.document.entities);
  } catch (error) {
    const typedError = error as Error;
    console.error(error);
    throw new Error(typedError.message);
  }
};

export const processBankStatement = async (
  client: DocumentProcessorServiceClient,
  uri: string,
  mimeType: string
) => {
  const request: google.cloud.documentai.v1.IProcessRequest = {
    name: BANK_STATEMENT_ID,
    gcsDocument: {
      gcsUri: uri,
      mimeType,
    },
  };

  try {
    const [result] = await client.processDocument(request);

    if (!result.document?.entities) {
      throw new Error('No entities present processing bank statement');
    }

    return parseBankStatementResponse(result.document.entities);
  } catch (error) {
    const typedError = error as Error;
    console.error(error);
    throw new Error(typedError.message);
  }
};
