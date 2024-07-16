import { UserI18nProtocol } from '@/infra/i18n/protocols/user-i18n.protocol';

export default {
  not_found: 'User not found',
  email_already_exists: 'Email already exists',
  cannot_create_super_admin: 'Cannot create super admin',
  cannot_create_admin: 'Cannot create admin',
  cannot_create_user: 'Cannot create user',
  cannot_update_super_admin: 'Cannot update super admin',
  cannot_update_admin: 'Cannot update admin',
  cannot_update_user: 'Cannot update user',
  cannot_delete_super_admin: 'Cannot delete super admin',
  cannot_delete_admin: 'Cannot delete admin',
  cannot_delete_user: 'Cannot delete user',

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
