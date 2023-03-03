export interface IUserGetByUniqueKey {
  username?: string;
  email?: string;
}

export interface ICreateUser {
  username: string;
  password: string;
}
