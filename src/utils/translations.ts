export type Language = "en" | "ru" | "uz" | "uz_cyrillic";

type TranslationObject = Record<Language, string>;
type TranslationValue =
  | TranslationObject
  | ((...args: any[]) => TranslationObject);

// Just add new translations here typing works out of the box
const translations = {
  welcome: (firstName: string) => ({
    en: `Hi ${firstName}! I'm your all-in-one file converter.\n\nSend me any file — document, image, audio, or video — and I'll convert it to the format you need.\n\n📄 Documents: PDF, DOCX, EPUB, HTML...\n🖼 Images: PNG, JPG, WEBP, SVG...\n🎵 Audio: MP3, WAV, OGG, FLAC...\n🎬 Video: MP4, MKV, AVI, WEBM...\n\nJust send a file to get started!`,
    ru: `Привет, ${firstName}! Я универсальный конвертер файлов.\n\nОтправьте мне любой файл — документ, изображение, аудио или видео — и я конвертирую его в нужный формат.\n\n📄 Документы: PDF, DOCX, EPUB, HTML...\n🖼 Изображения: PNG, JPG, WEBP, SVG...\n🎵 Аудио: MP3, WAV, OGG, FLAC...\n🎬 Видео: MP4, MKV, AVI, WEBM...\n\nПросто отправьте файл, чтобы начать!`,
    uz: `Salom ${firstName}! Men universal fayl konverteriman.\n\nMenga istalgan faylni yuboring — hujjat, rasm, audio yoki video — va men uni kerakli formatga o'tkazib beraman.\n\n📄 Hujjatlar: PDF, DOCX, EPUB, HTML...\n🖼 Rasmlar: PNG, JPG, WEBP, SVG...\n🎵 Audio: MP3, WAV, OGG, FLAC...\n🎬 Video: MP4, MKV, AVI, WEBM...\n\nBoshlash uchun fayl yuboring!`,
    uz_cyrillic: `Салом ${firstName}! Мен универсал файл конвертериман.\n\nМенга исталган файлни юборинг — ҳужжат, расм, аудио ёки видео — ва мен уни керакли форматга ўтказиб бераман.\n\n📄 Ҳужжатлар: PDF, DOCX, EPUB, HTML...\n🖼 Расмлар: PNG, JPG, WEBP, SVG...\n🎵 Аудио: MP3, WAV, OGG, FLAC...\n🎬 Видео: MP4, MKV, AVI, WEBM...\n\nБошлаш учун файл юборинг!`,
  }),
  chooseLanguage: {
    en: "🌐 Choose your language:",
    ru: "🌐 Выберите язык:",
    uz: "🌐 Tilni tanlang:",
    uz_cyrillic: "🌐 Тилни танланг:",
  },
  languageSet: {
    en: "Language set to English.",
    ru: "Язык установлен: Русский.",
    uz: "Til tanlandi: O'zbekcha.",
    uz_cyrillic: "Тил танланди: Ўзбекча (Кирилл).",
  },
  pleaseStartBot: {
    en: "Please start the bot first using /start command",
    ru: "Пожалуйста, начните бота сначала, используя команду /start",
    uz: "Botni ishga tushirish uchun /start buyrug'ini yuboring",
    uz_cyrillic: "Ботни ишга тушириш учун /start буйруғини юборинг",
  },
  help: {
    en: "📖 <b>How to use this bot:</b>\n\n1. Send me any file (document, photo, audio, video)\n2. Choose the target format from the list\n3. Wait a moment — I'll send back the converted file\n\n<b>Supported formats:</b>\n📄 Documents — PDF, DOCX, ODT, EPUB, HTML, TXT, RTF, CSV...\n🖼 Images — PNG, JPG, WEBP, SVG, GIF, BMP, TIFF, ICO, AVIF...\n🎵 Audio — MP3, WAV, OGG, FLAC, AAC, M4A, OPUS...\n🎬 Video — MP4, MKV, AVI, WEBM, MOV, FLV, GIF...\n📚 E-books — EPUB, MOBI, AZW3, FB2, PDF...\n\n<b>Limits:</b> 100 conversions/month, max file size 20MB\n\n/start — Restart & change language\n/help — This message",
    ru: "📖 <b>Как пользоваться ботом:</b>\n\n1. Отправьте мне любой файл (документ, фото, аудио, видео)\n2. Выберите целевой формат из списка\n3. Подождите — я отправлю конвертированный файл\n\n<b>Поддерживаемые форматы:</b>\n📄 Документы — PDF, DOCX, ODT, EPUB, HTML, TXT, RTF, CSV...\n🖼 Изображения — PNG, JPG, WEBP, SVG, GIF, BMP, TIFF, ICO, AVIF...\n🎵 Аудио — MP3, WAV, OGG, FLAC, AAC, M4A, OPUS...\n🎬 Видео — MP4, MKV, AVI, WEBM, MOV, FLV, GIF...\n📚 Электронные книги — EPUB, MOBI, AZW3, FB2, PDF...\n\n<b>Лимиты:</b> 100 конвертаций/месяц, макс. размер файла 20МБ\n\n/start — Перезапуск и смена языка\n/help — Это сообщение",
    uz: "📖 <b>Botdan foydalanish:</b>\n\n1. Menga istalgan faylni yuboring (hujjat, rasm, audio, video)\n2. Ro'yxatdan kerakli formatni tanlang\n3. Biroz kuting — men faylni yangi formatda qaytaraman\n\n<b>Qo'llab-quvvatlanadigan formatlar:</b>\n📄 Hujjatlar — PDF, DOCX, ODT, EPUB, HTML, TXT, RTF, CSV...\n🖼 Rasmlar — PNG, JPG, WEBP, SVG, GIF, BMP, TIFF, ICO, AVIF...\n🎵 Audio — MP3, WAV, OGG, FLAC, AAC, M4A, OPUS...\n🎬 Video — MP4, MKV, AVI, WEBM, MOV, FLV, GIF...\n📚 Elektron kitoblar — EPUB, MOBI, AZW3, FB2, PDF...\n\n<b>Limitlar:</b> 100 konvertatsiya/oy, maks fayl hajmi 20MB\n\n/start — Qayta boshlash va til tanlash\n/help — Ushbu xabar",
    uz_cyrillic:
      "📖 <b>Ботдан фойдаланиш:</b>\n\n1. Менга исталган файлни юборинг (ҳужжат, расм, аудио, видео)\n2. Рўйхатдан керакли форматни танланг\n3. Бироз кутинг — мен файлни янги форматда қайтараман\n\n<b>Қўллаб-қувватланадиган форматлар:</b>\n📄 Ҳужжатлар — PDF, DOCX, ODT, EPUB, HTML, TXT, RTF, CSV...\n🖼 Расмлар — PNG, JPG, WEBP, SVG, GIF, BMP, TIFF, ICO, AVIF...\n🎵 Аудио — MP3, WAV, OGG, FLAC, AAC, M4A, OPUS...\n🎬 Видео — MP4, MKV, AVI, WEBM, MOV, FLV, GIF...\n📚 Электрон китоблар — EPUB, MOBI, AZW3, FB2, PDF...\n\n<b>Лимитлар:</b> 100 конвертация/ой, макс файл ҳажми 20МБ\n\n/start — Қайта бошлаш ва тил танлаш\n/help — Ушбу хабар",
  },
  sendFile: {
    en: "Send me a file and I'll convert it for you!",
    ru: "Отправьте мне файл, и я конвертирую его для вас!",
    uz: "Menga fayl yuboring, men uni siz uchun boshqa formatga o'tkazib beraman!",
    uz_cyrillic:
      "Менга файл юборинг, мен уни сиз учун бошқа форматга ўтказиб бераман!",
  },
  selectFormat: (ext: string, total: number) => ({
    en: `📁 <b>${ext.toUpperCase()}</b> file received.\n\nChoose the format to convert to (${total} available):`,
    ru: `📁 Получен файл <b>${ext.toUpperCase()}</b>.\n\nВыберите формат для конвертации (${total} доступно):`,
    uz: `📁 <b>${ext.toUpperCase()}</b> fayl qabul qilindi.\n\nKonvertatsiya formatini tanlang (${total} ta mavjud):`,
    uz_cyrillic: `📁 <b>${ext.toUpperCase()}</b> файл қабул қилинди.\n\nКонвертация форматини танланг (${total} та мавжуд):`,
  }),
  showMore: {
    en: "Show more formats ▼",
    ru: "Ещё форматы ▼",
    uz: "Ko'proq formatlar ▼",
    uz_cyrillic: "Кўпроқ форматлар ▼",
  },
  showLess: {
    en: "▲ Show less",
    ru: "▲ Свернуть",
    uz: "▲ Kamroq ko'rsatish",
    uz_cyrillic: "▲ Камроқ кўрсатиш",
  },
  queued: (
    toExt: string,
    remaining: number,
    limit: number,
    queuePos: number,
    queueTotal: number,
  ) => ({
    en: `The file will be converted to <b>${toExt.toUpperCase()}</b>...\nThe conversion will start soon. Please wait.\n\n💎 Conversions left: <b>${remaining}/${limit}</b> (-1)\n🛎 Position in queue: <b>${queuePos}</b> of <b>${queueTotal}</b>`,
    ru: `Файл будет конвертирован в <b>${toExt.toUpperCase()}</b>...\nКонвертация начнётся скоро. Пожалуйста, подождите.\n\n💎 Осталось конвертаций: <b>${remaining}/${limit}</b> (-1)\n🛎 Позиция в очереди: <b>${queuePos}</b> из <b>${queueTotal}</b>`,
    uz: `Fayl <b>${toExt.toUpperCase()}</b> formatiga konvertatsiya qilinadi...\nKonvertatsiya tez orada boshlanadi. Iltimos kuting.\n\n💎 Qolgan konvertatsiyalar: <b>${remaining}/${limit}</b> (-1)\n🛎 Navbatdagi o'rni: <b>${queuePos}</b> / <b>${queueTotal}</b>`,
    uz_cyrillic: `Файл <b>${toExt.toUpperCase()}</b> форматига конвертация қилинади...\nКонвертация тез орада бошланади. Илтимос кутинг.\n\n💎 Қолган конвертациялар: <b>${remaining}/${limit}</b> (-1)\n🛎 Навбатдаги ўрни: <b>${queuePos}</b> / <b>${queueTotal}</b>`,
  }),
  processing: (toExt: string, remaining: number, limit: number) => ({
    en: `⏳ Converting to <b>${toExt.toUpperCase()}</b>...\nPlease wait, this may take a moment.\n\n💎 Conversions left: <b>${remaining}/${limit}</b> (-1)`,
    ru: `⏳ Конвертация в <b>${toExt.toUpperCase()}</b>...\nПожалуйста, подождите.\n\n💎 Осталось конвертаций: <b>${remaining}/${limit}</b> (-1)`,
    uz: `⏳ <b>${toExt.toUpperCase()}</b> formatiga konvertatsiya qilinmoqda...\nIltimos kuting.\n\n💎 Qolgan konvertatsiyalar: <b>${remaining}/${limit}</b> (-1)`,
    uz_cyrillic: `⏳ <b>${toExt.toUpperCase()}</b> форматига конвертация қилинмоқда...\nИлтимос кутинг.\n\n💎 Қолган конвертациялар: <b>${remaining}/${limit}</b> (-1)`,
  }),
  conversionDone: (fromExt: string, toExt: string) => ({
    en: `✅ ${fromExt.toUpperCase()} → ${toExt.toUpperCase()}`,
    ru: `✅ ${fromExt.toUpperCase()} → ${toExt.toUpperCase()}`,
    uz: `✅ ${fromExt.toUpperCase()} → ${toExt.toUpperCase()}`,
    uz_cyrillic: `✅ ${fromExt.toUpperCase()} → ${toExt.toUpperCase()}`,
  }),
  conversionFailed: {
    en: "❌ <b>Conversion failed.</b>\n\nThis can happen if the file is corrupted or the format combination isn't supported. Please try a different format.",
    ru: "❌ <b>Конвертация не удалась.</b>\n\nЭто может произойти, если файл повреждён или комбинация форматов не поддерживается. Попробуйте другой формат.",
    uz: "❌ <b>Konvertatsiya amalga oshmadi.</b>\n\nBu fayl buzilgan yoki format kombinatsiyasi qo'llab-quvvatlanmasligi sababli bo'lishi mumkin. Boshqa formatni sinab ko'ring.",
    uz_cyrillic:
      "❌ <b>Конвертация амалга ошмади.</b>\n\nБу файл бузилган ёки формат комбинацияси қўллаб-қувватланмаслиги сабабли бўлиши мумкин. Бошқа форматни синаб кўринг.",
  },
  unsupportedFormat: {
    en: "🚫 This file format is not supported for conversion.\n\nTry sending the file as a <b>document</b> (use the 📎 attachment button) so the original format is preserved.",
    ru: "🚫 Этот формат файла не поддерживается.\n\nПопробуйте отправить файл как <b>документ</b> (используйте кнопку 📎), чтобы сохранить оригинальный формат.",
    uz: "🚫 Bu fayl formati qo'llab-quvvatlanmaydi.\n\nFaylni <b>hujjat</b> sifatida yuboring (📎 tugmasidan foydalaning), shunda original format saqlanadi.",
    uz_cyrillic:
      "🚫 Бу файл формати қўллаб-қувватланмайди.\n\nФайлни <b>ҳужжат</b> сифатида юборинг (📎 тугмасидан фойдаланинг), шунда оригинал формат сақланади.",
  },
  rateLimitExceeded: (days: number) => ({
    en: `⚠️ You've reached your monthly limit of 100 conversions.\n\nYour limit resets in <b>${days} days</b>.`,
    ru: `⚠️ Вы достигли месячного лимита в 100 конвертаций.\n\nЛимит сбросится через <b>${days} дней</b>.`,
    uz: `⚠️ Siz oylik 100 konvertatsiya limitiga yetdingiz.\n\n<b>${days} kun</b>dan keyin limit yangilanadi.`,
    uz_cyrillic: `⚠️ Сиз ойлик 100 конвертация лимитига етдингиз.\n\n<b>${days} кун</b>дан кейин лимит янгиланади.`,
  }),
  fileTooLarge: {
    en: "⚠️ File is too large. Maximum size is <b>20MB</b>.",
    ru: "⚠️ Файл слишком большой. Максимальный размер — <b>20МБ</b>.",
    uz: "⚠️ Fayl juda katta. Maksimal hajmi — <b>20MB</b>.",
    uz_cyrillic: "⚠️ Файл жуда катта. Максимал ҳажми — <b>20МБ</b>.",
  },
  conversionExpired: {
    en: "⏰ This conversion has expired. Please send the file again.",
    ru: "⏰ Эта конвертация истекла. Пожалуйста, отправьте файл снова.",
    uz: "⏰ Bu konvertatsiya muddati tugagan. Iltimos, faylni qaytadan yuboring.",
    uz_cyrillic:
      "⏰ Бу конвертация муддати тугаган. Илтимос, файлни қайтадан юборинг.",
  },
  textMessage: {
    en: "I'm a file converter bot! Send me any file — document, photo, audio, or video — and I'll convert it to any format you need.\n\nUse /help to see all supported formats.",
    ru: "Я бот-конвертер файлов! Отправьте мне любой файл — документ, фото, аудио или видео — и я конвертирую его в нужный формат.\n\nИспользуйте /help чтобы увидеть все поддерживаемые форматы.",
    uz: "Men fayl konvertatsiya qiluvchi botman! Menga istalgan faylni yuboring — hujjat, rasm, audio yoki video — va men uni kerakli formatga o'tkazib beraman.\n\n/help — barcha qo'llab-quvvatlanadigan formatlar.",
    uz_cyrillic:
      "Мен файл конвертация қилувчи ботман! Менга исталган файлни юборинг — ҳужжат, расм, аудио ёки видео — ва мен уни керакли форматга ўтказиб бераман.\n\n/help — барча қўллаб-қувватланадиган форматлар.",
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
  language: Language = "en",
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
