export const UserCodeStatus = {
  PENDING: 1,
  VERIFIED: 2,
  USED: 3,
  INVALIDATED: 5,
} as const;

export type UserCodeStatus =
  (typeof UserCodeStatus)[keyof typeof UserCodeStatus];
