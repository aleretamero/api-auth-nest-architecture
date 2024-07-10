namespace SessionPresenter {
  export type Props = {
    accessToken: string;
    refreshToken: string;
  };
}

export class SessionPresenter {
  public accessToken!: string;
  public refreshToken!: string;

  constructor(data: Partial<SessionPresenter>) {
    Object.assign(this, data);
  }

  present(data: SessionPresenter.Props): SessionPresenter {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;

    return this;
  }
}
