export interface TableItem {
  date: string;
  description: string;
  expense: number;
  income: number;
}

export interface ParsedBankStatement {
  openingBalance: {
    amount: number;
    confidence: number;
  };
  closingBalance: {
    amount: number;
    confidence: number;
  };
  statementStartDate: {
    date: string;
    confidence: number;
  };
  statementEndDate: {
    date: string;
    confidence: number;
  };
  tableItems: TableItem[];
}

export interface MondayTableValue {
  amount: number;
  description: string;
  confidence: number;
}

export interface ParsedPayslip {
  netPay: {
    amount: number;
    confidence: number;
  };
  payDate: {
    date: string;
    confidence: number;
  };
  deductions: MondayTableValue[];
  earnings: MondayTableValue[];
}

export interface ParsedNamibianId {
  firstName: {
    text: string;
    confidence: number;
  };
  surname: {
    text: string;
    confidence: number;
  };
  idNumber: {
    text: string;
    confidence: number;
  };
  dob: string;
}

export interface ExtractionInstance {
  uid: string;
  status: 'processing' | 'review' | 'approved' | 'rejected' | 'error';
  createdAt: number;
  bankStatement: {
    gcsUri: string;
    documentType: string;
    mimeType: string;
  };
  payslip: {
    gcsUri: string;
    documentType: string;
    mimeType: string;
  };
  namibianId: {
    gcsUri: string;
    documentType: string;
    mimeType: string;
  };
  namibianIdRes?: ParsedNamibianId;
  payslipRes?: ParsedPayslip;
  bankStatementRes?: ParsedBankStatement;
  name: string;
  warnings: string[];
}
