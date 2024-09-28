import type { ClassifyDocRes } from '../backend/functions';

export const getHighestConfidenceClassification = (
  classifyResults: ClassifyDocRes[]
): string => {
  let highestConfidence = 0;
  let type = '';

  for (const result of classifyResults) {
    if (result.confidence > highestConfidence) {
      highestConfidence = result.confidence;
      type = result.type;
    }
  }

  return type;
};
