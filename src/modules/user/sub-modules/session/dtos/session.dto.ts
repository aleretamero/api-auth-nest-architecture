export class SessionDto {
  constructor(
    public accessToken: string,
    public refreshToken: string,
  ) {}
}
