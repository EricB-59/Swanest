export class UserLabels {
  constructor(
    public first_label: string,
    public second_label: string,
    public third_label: string,
    public fourth_label: string,
    public fifth_label: string,
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
    public gender: number,
    public province: string,
    public labels: UserLabels,
    public user_id: number,
    public images: Images,
  ) {}
}
