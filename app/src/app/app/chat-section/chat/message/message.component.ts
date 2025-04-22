import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  imports: [],
  template: `
    @if (sender == USER_ID) {
      <article class="font-family-regular flex flex-1 flex-col items-end p-5">
        <span class="text-text-secondary p-1 text-sm lg:text-lg">{{
          this.hour
        }}</span>
        <div
          class="bg-primary-main w-fit max-w-1/2 rounded-tl-[50px] rounded-b-[50px] p-5"
        >
          <h2 class="text-sm text-white lg:text-xl">{{ this.content }}</h2>
        </div>
      </article>
    } @else {
      <article
        class="font-family-regular flex flex-2 flex-col justify-start p-5"
      >
        <span class="text-text-secondary p-1 text-sm lg:text-lg">{{
          this.hour
        }}</span>
        <div
          class="w-fit max-w-1/2 rounded-tr-[50px] rounded-b-[50px] bg-[#E8E8E8] p-5"
        >
          <h2 class="text-sm lg:text-xl">{{ this.content }}</h2>
        </div>
      </article>
    }
  `,
  styles: ``,
})
export class MessageComponent implements OnInit {
  @Input() content: string = '';
  @Input() hour: string = '';
  @Input() sender: number = 0;

  USER_ID: number = 0;

  ngOnInit(): void {
    const userString: string | null = sessionStorage.getItem('user');

    if (userString) {
      const userObj = JSON.parse(userString);
      this.USER_ID = userObj.id;
    }
  }
}
