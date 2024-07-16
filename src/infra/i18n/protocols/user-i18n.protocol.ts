export interface UserI18nProtocol {
  not_found: string;
  email_already_exists: string;
  cannot_create_super_admin: string;
  cannot_create_admin: string;
  cannot_create_user: string;
  cannot_update_super_admin: string;
  cannot_update_admin: string;
  cannot_update_user: string;
  cannot_delete_super_admin: string;
  cannot_delete_admin: string;
  cannot_delete_user: string;

  session: {
    not_found: string;
  };

  user_code: {
    not_found: string;
    invalid: string;
  };

  personal_data: {
    not_found: string;
    already_exists: string;
  };
}
