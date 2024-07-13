export const Role = {
  USER: 0,
  ADMIN: 1,
} as const;

export type Role = (typeof Role)[keyof typeof Role];
