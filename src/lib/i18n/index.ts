import en from './en.json';
import es from './es.json';
import fi from './fi.json';

export const translations = {
  en,
  es,
  fi,
};

export type Locale = keyof typeof translations;
