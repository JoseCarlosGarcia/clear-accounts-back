import { Injectable } from '@nestjs/common';
import TextNormalizer from '../interfaces/text.normalizer';

@Injectable()
export class SimpleTextNormalizer implements TextNormalizer {
  /**
   * Normalizes a string:
   * - removes accents/diacritics
   * - removes spaces
   * - keeps only alphanumeric characters
   * - converts to lowercase
   */
  normalize(text: string): string {
    if (!text) return '';
    return text
      .normalize('NFD') // split accented letters
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/\s+/g, '') // remove spaces
      .replace(/[^a-zA-Z0-9]/g, '') // remove non-alphanumeric characters
      .toLowerCase(); // lowercase
  }
}
