import { Ngram } from '@/models';

/**
 * counts repeated ngrams in a text.
 * @param ngrams - Array of strings.
 * @returns Array of ngrams.
 */
export function charactersCleanInNgrams(ngrams: Ngram[]): Ngram[] {
  const ngramsList = ngrams.map((ngram) => {
    const word = ngram.word.trim().replace(/[!;,.?¡¿“”:"#$%&/()=]/g, '');
    return { word, count: ngram.count };
  });
  return ngramsList;
}
