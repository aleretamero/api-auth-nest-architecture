import { UserI18nProtocol } from '@/infra/i18n/protocols/user-i18n.protocol';

export default {
  not_found: 'User not found',
  email_already_exists: 'Email already exists',
  cannot_delete_another_admin: 'Cannot delete another admin',
  cannot_delete_another_user: 'Cannot delete another user',

  session: {
    not_found: 'Session not found',
  },

  user_code: {
    not_found: 'User code not found',
    invalid: 'User code invalid',
  },

  personal_data: {
    not_found: 'Personal data not found',
    already_exists: 'Personal data already exists',
  },
} satisfies UserI18nProtocol;
