export class Feedback {
  email: string;
  subject: string;
  message: string;

  constructor({
    email,
    subject,
    message,
  }: {
    email: string;
    subject: string;
    message: string;
  }) {
    this.email = email;
    this.subject = subject;
    this.message = message;
  }
}
