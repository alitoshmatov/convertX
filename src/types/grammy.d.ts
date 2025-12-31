import { User } from "@prisma/client";
import { getTranslationForSpecificLanguage } from "../utils/translations";

declare module "grammy" {
  export interface Context {
    user?: User;
    translations: ReturnType<typeof getTranslationForSpecificLanguage>;
  }
}
