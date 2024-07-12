import { UserI18nProtocol } from '@/infra/i18n/protocols/user-i18n.protocol';
import { AuthI18nProtocol } from '@/infra/i18n/protocols/auth-i18n.protocol';

export interface I18nTranslations {
  auth: AuthI18nProtocol;
  user: UserI18nProtocol;
}
