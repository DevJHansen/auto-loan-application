import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();
import cors from 'cors';
import { onRequest } from 'firebase-functions/v2/https';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { EXTRACTION_INSTANCE_COLLECTION } from './constants/firestore';
import { ExtractionInstance } from './types/extraction';
import {
  processBankStatement,
  processNamibianId,
  processPayslip,
} from './utils/processors';
import { region } from 'firebase-functions/v1';
import { parseNamibianIdResponse } from './utils/namibianIdUtils';
import { parsePayslipResponse } from './utils/payslipUtils';
import { parseBankStatementResponse } from './utils/bankStatementUtils';
import {
  areDatesAtLeastThreeMonthsApart,
  isOlderThanThreeMonths,
} from './utils/general';
import { isUserAuthorized } from './utils/authUtils';

const client = new DocumentProcessorServiceClient();

const corsHandler = cors({ origin: true });

const config = {
  region: 'europe-west3',
  allowUnauthorized: true,
};

// TODO: Setup auth for all endpoints

export const extractBankStatement = onRequest(config, async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const authorized = await isUserAuthorized(req, res);

      if (!authorized) {
        functions.logger.info('User not authorized to share submission');
        return;
      }

      const processorId =
        'projects/245752770740/locations/us/processors/6364fd782c4ce406';

      const request = {
        name: processorId,
        rawDocument: {
          content: req.body.documentBase64,
          mimeType: req.body.mimeType,
        },
      };

      const [result] = await client.processDocument(request);

      if (!result.document?.entities) {
        throw new Error('No entities present processing bank statement');
      }

      res
        .status(200)
        .send(parseBankStatementResponse(result.document.entities));
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
});

export const extractPayslip = onRequest(config, async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const authorized = await isUserAuthorized(req, res);

      if (!authorized) {
        functions.logger.info('User not authorized to share submission');
        return;
      }

      const processorId =
        'projects/245752770740/locations/us/processors/41cc01dee31ccff1';
      // 'projects/245752770740/locations/us/processors/4d029d815c608359';

      const request = {
        name: processorId,
        rawDocument: {
          content: req.body.documentBase64,
          mimeType: req.body.mimeType,
        },
      };

      const [result] = await client.processDocument(request);

      if (!result.document?.entities) {
        throw new Error('No entities present processing payslip');
      }

      res.status(200).send(parsePayslipResponse(result.document.entities));
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
});

export const extractIdDocument = onRequest(config, async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const authorized = await isUserAuthorized(req, res);

      if (!authorized) {
        functions.logger.info('User not authorized to share submission');
        return;
      }

      const processorId =
        'projects/245752770740/locations/us/processors/57881faf756a36f4';

      const request = {
        name: processorId,
        rawDocument: {
          content: req.body.documentBase64,
          mimeType: req.body.mimeType,
        },
      };

      const [result] = await client.processDocument(request);

      if (!result.document?.entities) {
        throw new Error('No entities present processing Namibian Id');
      }

      res.status(200).send(parseNamibianIdResponse(result.document.entities));
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
});

export const classifyDocument = onRequest(config, async (req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const authorized = await isUserAuthorized(req, res);

      if (!authorized) {
        functions.logger.info('User not authorized to share submission');
        return;
      }

      const processorId =
        'projects/245752770740/locations/us/processors/9cce90838b413553';

      const request = {
        name: processorId,
        rawDocument: {
          content: req.body.documentBase64,
          mimeType: req.body.mimeType,
        },
      };

      const [result] = await client.processDocument(request);

      if (!result.document?.entities) {
        res.status(500).send({ message: 'Entities not found' });
        return;
      }

      res.status(200).send(result.document.entities);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
});

export const onCreateNewInstance = region('europe-west3')
  .firestore.document(`${EXTRACTION_INSTANCE_COLLECTION}/{instanceId}`)
  .onCreate(async (snapshot) => {
    functions.logger.log('New doc added');

    if (!snapshot.exists) {
      functions.logger.log('No data');
      return;
    }

    const instance = snapshot.data() as ExtractionInstance;
    const docRef = db
      .collection(EXTRACTION_INSTANCE_COLLECTION)
      .doc(snapshot.id);

    try {
      const [bankStatementRes, payslipRes, namibianIdRes] = await Promise.all([
        processBankStatement(
          client,
          instance.bankStatement.gcsUri,
          instance.bankStatement.mimeType
        ),
        processPayslip(
          client,
          instance.payslip.gcsUri,
          instance.payslip.mimeType
        ),
        processNamibianId(
          client,
          instance.namibianId.gcsUri,
          instance.namibianId.mimeType
        ),
      ]);

      const warnings: string[] = [];

      if (payslipRes.netPay.amount === 0) {
        warnings.push('Net pay not found');
      }

      const statementContainsNetPay = bankStatementRes.tableItems.some(
        (item) => item.income === payslipRes.netPay.amount
      );

      if (!statementContainsNetPay && payslipRes.netPay.amount !== 0) {
        warnings.push(
          `Net pay of N$ ${payslipRes.netPay.amount} not found on bank statement`
        );
      }

      if (isOlderThanThreeMonths(payslipRes.payDate.date)) {
        warnings.push('Payslip is older than 3 months');
      }

      if (isOlderThanThreeMonths(bankStatementRes.statementEndDate.date)) {
        warnings.push('Bank statement is older than 3 months');
      }

      if (
        !areDatesAtLeastThreeMonthsApart(
          bankStatementRes.statementStartDate.date,
          bankStatementRes.statementEndDate.date
        )
      ) {
        warnings.push('Bank statement is less than 3 months in length');
      }

      await docRef.update({
        bankStatementRes,
        payslipRes,
        namibianIdRes,
        status: 'review',
        warnings,
      });
    } catch (error) {
      console.error(error);
      await docRef.update({
        status: 'error',
      });
    }
  });
