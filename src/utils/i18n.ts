import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from '../assets/translations/pt.json';
import en from '../assets/translations/en.json';
import es from '../assets/translations/es.json';

const resources = {
  'pt-BR': { translation: pt },
  en: { translation: en },
  es: { translation: es },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    supportedLngs: ['pt-BR', 'en', 'es'],
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
