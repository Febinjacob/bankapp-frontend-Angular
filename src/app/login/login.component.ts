import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { style } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginError:string='';
  loginSuccess:boolean=false;

  constructor(private fb:FormBuilder,private api:ApiService,private loginRouter:Router){}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  loginForm=this.fb.group({//form group
    acno:['',[Validators.required,Validators.pattern('[0-9 ]*')]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9 ]*')]],

  })
  login(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
  
    let acno=this.loginForm.value.acno
    let password=this.loginForm.value.password
    console.log(acno,password);
    this.api.login(acno,password).subscribe((response:any)=>{

      console.log(response);
      
      // login success
      // To set current username into the local storage
      this.loginSuccess=true
      localStorage.setItem('currentUser',response.currentUser)

      // To set current balance into the local storage
      localStorage.setItem('balance',response.balance)

      // To set currentAcno balance into the local storage
      localStorage.setItem('currentAcno',response.currentAcno)

      // To set token balance into the local storage
      localStorage.setItem('token',response.token)

      // alert('Login Successfull')
      setTimeout(()=>{
        this.loginRouter.navigateByUrl('/dashboard')
      },3000)

     

    },
    (response:any)=>{
      // error message
      this.loginError=response.error.message;
      setTimeout(()=>{
        this.loginForm.reset();
        this.loginError=''
      },3000)
    }
    )
    
    }
    else{
       alert('Invalid Entries')
    }
 
    
    
    
  }

}
