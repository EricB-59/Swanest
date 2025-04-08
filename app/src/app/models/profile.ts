import { User } from './user';
import { Gender } from './gender';
import { Province } from './province';
import { UserLabel } from './userLabel';

export class Profile {
  id: number | null = null;
  user: User | null = null;
  first_name: string | null = null;
  last_name: string | null = null;
  bio: string | null = null;
  gender: Gender | null = null;
  birthdate: Date | null = null;
  province: Province | null = null;
  created_at: Date | null = null;
  updated_at: Date | null = null;
  labels: UserLabel | null = null;

  constructor(
    id: number | null = null,
    user: User | null = null,
    first_name: string | null = null,
    last_name: string | null = null,
    bio: string | null = null,
    gender: Gender | null = null,
    birthdate: Date | null = null,
    province: Province | null = null,
    created_at: Date | null = null,
    updated_at: Date | null = null,
    labels: UserLabel | null = null,
  ) {
    this.id = id;
    this.user = user;
    this.first_name = first_name;
    this.last_name = last_name;
    this.bio = bio;
    this.gender = gender;
    this.birthdate = birthdate;
    this.province = province;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.labels = labels;
  }
}
