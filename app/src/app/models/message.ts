export class Message {
  sender_id: number;
  receiver_id: number;
  content: string;

  constructor(sender_id: number, receiver_id: number, content: string) {
    this.sender_id = sender_id;
    this.receiver_id = receiver_id;
    this.content = content;
  }
}
