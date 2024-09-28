import { resolve } from 'path';
import { config } from 'dotenv';

config({
  path: resolve(__dirname, '../../.env'),
});

const {
  PROJECT_ID = '',
  BANK_STATEMENT_PROCESSOR = '',
  PAYSLIP_PROCESSOR = '',
  NAMIBIAN_ID_PROCESSOR = '',
  CLASSIFIER_PROCESSOR = '',
} = process.env;

export const BANK_STATEMENT_ID = `projects/${PROJECT_ID}/locations/us/processors/${BANK_STATEMENT_PROCESSOR}`;
export const PAYSLIP_ID = `projects/${PROJECT_ID}/locations/us/processors/${PAYSLIP_PROCESSOR}`;
export const NAMIBIAN_ID_ID = `projects/${PROJECT_ID}/locations/us/processors/${NAMIBIAN_ID_PROCESSOR}`;
export const CLASSIFIER_ID = `projects/${PROJECT_ID}/locations/us/processors/${CLASSIFIER_PROCESSOR}`;
