import { Component, OnInit, inject } from '@angular/core';
import { FeedbackService } from '../../../services/feedback/feedback.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Feedback } from '../../../models/feedback';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styles: ``,
})
export class ContactComponent {
  constructor(
    private router: Router,
    private feedbackService: FeedbackService,
  ) {}

  form = new FormGroup({
    email: new FormControl(''),
    subject: new FormControl(''),
    message: new FormControl(''),
  });

  add() {
    let feedback = new Feedback({
      email: this.form.value.email as string,
      subject: this.form.value.subject as string,
      message: this.form.value.message as string,
    });

    this.feedbackService.create(feedback).subscribe((result) => {
      console.log(result);
    });
  }
}
