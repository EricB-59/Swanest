export class UserLabels {
  constructor(
    public first_label: label,
    public second_label: label,
    public third_label: label,
    public fourth_label: label,
    public fifth_label: label,
  ) {}
}

export class Images {
  constructor(
    public image_1: string,
    public image_2: string,
    public image_3: string,
    public image_4: string,
    public image_5: string,
  ) {}
}

export class Profile {
  constructor(
    public first_name: string,
    public last_name: string,
    public bio: string,
    public birthdate: string,
    public gender: Gender,
    public province: Province,
    public labels: UserLabels,
    public user_id: number,
    public images: Images,
  ) {}
}

export interface Gender {
  name: string;
}

export interface Province {
  name: string;
}

export interface label {
  name: string;
}
