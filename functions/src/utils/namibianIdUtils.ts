import { google } from '@google-cloud/documentai/build/protos/protos';
import { ParsedNamibianId } from '../types/extraction';

function formatDateFromString(input: string): string {
  const yy = input.substring(0, 2);
  const mm = input.substring(2, 4);
  const dd = input.substring(4, 6);

  const currentYear = new Date().getFullYear() % 100;

  const century = parseInt(yy) > currentYear ? 1900 : 2000;

  const year = century + parseInt(yy);
  const formattedDate = `${year}-${mm}-${dd}`;

  return formattedDate;
}

export const parseNamibianIdResponse = (
  entities: google.cloud.documentai.v1.Document.IEntity[]
): ParsedNamibianId => {
  const firstNameEntity = entities.filter(
    (entity) => entity.type === 'first_name'
  );
  const surnameEntity = entities.filter((entity) => entity.type === 'surname');
  const idNumberEntity = entities.filter(
    (entity) => entity.type === 'id_number'
  );

  let dob = '';

  if (idNumberEntity[0].mentionText) {
    dob = formatDateFromString(idNumberEntity[0].mentionText);
  }

  return {
    firstName: {
      text: firstNameEntity[0].mentionText ?? '',
      confidence: firstNameEntity[0].confidence ?? 0,
    },
    surname: {
      text: surnameEntity[0].mentionText ?? '',
      confidence: surnameEntity[0].confidence ?? 0,
    },
    idNumber: {
      text: idNumberEntity[0].mentionText ?? '',
      confidence: idNumberEntity[0].confidence ?? 0,
    },
    dob,
  };
};
