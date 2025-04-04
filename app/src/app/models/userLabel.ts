export class UserLabel {
  id: number;
  first_label: number;
  second_label: number;
  third_label: number;
  fourth_label: number;
  fifth_label: number;

  constructor({
    id,
    first_label,
    second_label,
    third_label,
    fourth_label,
    fifth_label,
  }: {
    id: number;
    first_label: number;
    second_label: number;
    third_label: number;
    fourth_label: number;
    fifth_label: number;
  }) {
    this.id = id;
    this.first_label = first_label;
    this.second_label = second_label;
    this.third_label = third_label;
    this.fourth_label = fourth_label;
    this.fifth_label = fifth_label;
  }
}
