export const UserCodeType = {
  EMAIL_VERIFICATION: 1,
  FORGOT_PASSWORD: 2,
};

export type UserCodeType = (typeof UserCodeType)[keyof typeof UserCodeType];
