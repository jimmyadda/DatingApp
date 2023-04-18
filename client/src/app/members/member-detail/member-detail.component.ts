import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';
import { User } from 'src/app/_models/user';
import { Member } from 'src/app/_modules/member';
import { Message } from 'src/app/_modules/message';
import { MessageService } from 'src/app/_service/message.service';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy{
  @ViewChild('memberTabs', {static:true}) memberTabs?: TabsetComponent;
 member: Member={} as Member;
 galleryOption: NgxGalleryOptions[]=[];
 galleryImages: NgxGalleryImage[]=[];
 activeTab?: TabDirective;
 messages:Message[]=[];
 user?: User;


  constructor(private accountService : AccountService, private route: ActivatedRoute,private messageService:MessageService,
    public presenceService:PresenceService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => {
          if (user) this.user = user;
        }
      })
    }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member = data['member']
    })
    
    this.route.queryParams.subscribe({
      next: params =>{
        params['tab'] && this.selectTab(params['tab'])
      }
    })
    this.galleryOption = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview:false
      }
    ]

    this.galleryImages = this.getImages();

  }
 ngOnDestroy(): void {
  this.messageService.stopHubConnection();   
 }
  getImages(){
    if(!this.member) return [];
    const imageUrls = [];

    for(const photo of this.member.photos)
    {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      })
    }
    return imageUrls;
  }
/*   loadMember(){
    var username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member,
        this.galleryImages = this.getImages();
        console.log(this.member) 
      }
    })
  } */

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading==='Messages'&& this.user){
      this.messageService.createHubConnection(this.user,this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  selectTab(heading: string)
  {
    if(this.memberTabs){
      this.memberTabs.tabs.find(x => x.heading=== heading)!.active=true
    } 
  }
  loadMessages(){
    if(this.member){
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
      })
    }
  }
}
