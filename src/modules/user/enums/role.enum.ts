export const Role = {
  USER: 0,
  ADMIN: 1,
  SUPER_ADMIN: 2,
} as const;

export type Role = (typeof Role)[keyof typeof Role];
