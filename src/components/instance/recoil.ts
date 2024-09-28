import { atom } from 'recoil';
import { ExtractionInstance } from '../../types/extraction';

export const extractionInstanceState = atom<ExtractionInstance | null>({
  key: 'extractionInstanceState',
  default: null,
});
