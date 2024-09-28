export type NormalizedValue = {
  text: string;
  moneyValue?: {
    currencyCode: string;
    units: string;
    nanos: number;
  };
  dateValue?: {
    year: number;
    month: number;
    day: number;
  };
};
