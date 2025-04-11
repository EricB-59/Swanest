import { Profile } from './profile';

export class User {
  username: string;
  email: string;
  password: string;
  image?: Image;
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

interface Image {
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
}
