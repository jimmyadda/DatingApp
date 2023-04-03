import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { isNgTemplate } from '@angular/compiler';
import { take } from 'rxjs';

@Directive({
  selector: '[appHasRole]' //*apphasRole='["admin","Thing"]'
})
export class HasRoleDirective implements OnInit{
  @Input() appHasRole: String[]=[];
  user : User = {} as User;

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>,
   private acccountService: AccountService) {
    this.acccountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) this.user=user 
      }
    })
    }
   ngOnInit(): void {
    if(this.user.roles.some(r => this.appHasRole.includes(r))){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }else{
      this.viewContainerRef.clear();
    }
     
   }
}
