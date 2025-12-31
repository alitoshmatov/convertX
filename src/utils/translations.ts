export type Language = "en" | "ru" | "uz" | "uz_cyrillic";

type TranslationObject = Record<Language, string>;
type TranslationValue =
  | TranslationObject
  | ((...args: any[]) => TranslationObject);

// Just add new translations here typing works out of the box
const translations = {
  welcome: (firstName: string) => ({
    en: `Welcome to the bot, ${firstName}!`,
    ru: `Добро пожаловать в бот, ${firstName}!`,
    uz: `Botga xush kelibsiz, ${firstName}!`,
    uz_cyrillic: `Ботга хуш келибсиз, ${firstName}!`,
  }),
  pleaseStartBot: {
    en: "Please start the bot first using /start command",
    ru: "Пожалуйста, начните бота сначала, используя команду /start",
    uz: "Botni ishga tushirish uchun /start buyrug'ini bosing",
    uz_cyrillic: "Ботни бошланг, сначала используйте команду /start",
  },
  help: {
    en: "Help",
    ru: "Помощь",
    uz: "Yordam",
    uz_cyrillic: "Yordam",
  },
} as const satisfies Record<string, TranslationValue>;

// Helper type to extract the correct return type for each translation key
type TranslatedValue<T> = T extends (...args: infer Args) => TranslationObject
  ? (...args: Args) => string
  : string;

type TranslatedObject = {
  [K in keyof typeof translations]: TranslatedValue<(typeof translations)[K]>;
};

export const getTranslationForSpecificLanguage = (
  language: Language = "en"
): TranslatedObject => {
  return Object.entries(translations).reduce((acc, [key, value]) => {
    const typedKey = key as keyof typeof translations;
    if (typeof value === "function") {
      // For functions, return a wrapper that calls the function and extracts the language
      acc[typedKey] = ((...args: Parameters<typeof value>) =>
        (value as Function)(...args)[language]) as TranslatedValue<
        typeof value
      >;
    } else {
      // For objects, directly extract the language value
      acc[typedKey] = value[language] as TranslatedValue<typeof value>;
    }
    return acc;
  }, {} as any) as TranslatedObject;
};
