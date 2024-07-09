import { Session } from '@/modules/session/entities/session.entity';

export class AuthPresenter {
  public accessToken!: string;
  public refreshToken!: string;

  constructor(data: Partial<AuthPresenter>) {
    Object.assign(this, data);
  }

  present(data: Session): AuthPresenter {
    return new AuthPresenter({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }
}
