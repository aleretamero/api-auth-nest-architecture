export interface AuthI18nProtocol {
  email_or_password_invalid: string;

  token: {
    not_found_or_invalid: string;
  };

  device_identifier: {
    not_found: string;
  };
}
