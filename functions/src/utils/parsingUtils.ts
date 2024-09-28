export function extractNumericValue(input: string): string {
  const numericValue = input.replace(/[^0-9.]/g, '');
  return numericValue;
}

export const parseMoneyText = (value: string) => {
  return parseFloat(extractNumericValue(value));
};

export function removeEscapedCharacters(input: string): string {
  const cleanedString = input.replace(/[\n\r\t\b\f\v]/g, '');
  return cleanedString;
}
