import { Profile } from './profile';

export class User {
  username: string;
  email: string;
  password: string;
  profile?: Profile;

  constructor({
    username,
    email,
    password,
    profile,
  }: {
    username: string;
    email: string;
    password: string;
    profile?: Profile;
  }) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.profile = profile;
  }
}
