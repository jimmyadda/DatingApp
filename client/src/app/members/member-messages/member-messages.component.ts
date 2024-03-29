import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_modules/message';
import { MessageService } from 'src/app/_service/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
@ViewChild('messageForm') messageForm?: NgForm
@Input() username?: string;  
//@Input() messages: Message[]=[];
messageContent ='';

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {

  }

  sendMessage(){
    if(!this.username) return;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
     this.messageForm?.reset(); 
    })
  }

}
