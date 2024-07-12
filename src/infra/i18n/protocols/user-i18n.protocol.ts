export interface UserI18nProtocol {
  not_found: string;
  email_already_exists: string;

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
