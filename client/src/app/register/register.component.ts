import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  registerForm : FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string|undefined;


  constructor(private accountService: AccountService,private toastr:ToastrService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18); 
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['',Validators.required],      
      KnownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required,this.matchValue('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }


 matchValue(MatchTo:string): ValidatorFn{
  return (control : AbstractControl) => {
    return control.value === control.parent?.get(MatchTo)?.value ? null : {notMatching: true}
  }
 }
 register(){
  const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value)
  const values= {...this.registerForm.value, dateOfBirth: dob };
  this.accountService.register(values).subscribe({
    next: () =>{
    this.router.navigateByUrl('/members')
    },
    error: error=> {   
      this.validationErrors = error;   
    }
  })
 }

 cancel(){
  this.cancelRegister.emit(false);
 }

 private getDateOnly(dob: string| undefined){
  if(!dob) return;
  let thedob = new Date(dob);
  return new Date(thedob.setMinutes(thedob.getMinutes()-thedob.getTimezoneOffset())).toISOString().slice(0,10);
 }
}
