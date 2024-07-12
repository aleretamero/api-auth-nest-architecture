import { AuthI18nProtocol } from '@/infra/i18n/protocols/auth-i18n.protocol';

export default {
  email_or_password_invalid: 'Email or password invalid',

  token: {
    not_found_or_invalid: 'Token not found or invalid',
  },

  device_identifier: {
    not_found: 'Device identifier not found',
  },
} satisfies AuthI18nProtocol;
