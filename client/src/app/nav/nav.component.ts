import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from '../_modules/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
   model:any= {};
   member : Member | undefined;
   user: User|null = null;

  constructor(public accountService: AccountService, private router:Router,
    private toaster:ToastrService) { }

  ngOnInit(): void {

  }

  login(){
    this.accountService.login(this.model).subscribe({
      next: _ =>  this.router.navigateByUrl('/members')
    })
    
  }
  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/')
  } 
}
