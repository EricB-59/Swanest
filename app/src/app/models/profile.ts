export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  bio: string;
  birthdate: string;
  created_at: string;
  updated_at: string;
  gender: Gender;
  province: Province;
  labels: UserLabels;
  user_id: number;
}

export interface Gender {
  id: number;
  name: string;
}

export interface Province {
  id: number;
  name: string;
}

export interface UserLabels {
  id: number;
  first_label: FirstLabel;
  second_label: SecondLabel;
  third_label: ThirdLabel;
  fourth_label: FourthLabel;
  fifth_label: FifthLabel;
}

export interface FirstLabel {
  id: number;
  name: string;
}

export interface SecondLabel {
  id: number;
  name: string;
}

export interface ThirdLabel {
  id: number;
  name: string;
}

export interface FourthLabel {
  id: number;
  name: string;
}

export interface FifthLabel {
  id: number;
  name: string;
}
