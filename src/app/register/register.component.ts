import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  RegisterError:string='';//to hold error message
  RegisterSuccess:string=''//to hold login successful details

  constructor(private fb:FormBuilder,private api:ApiService, private loginRouter:Router){}

  registerForm=this.fb.group({//form group
    username:['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],//form array
    acno:['',[Validators.required,Validators.pattern('[0-9 ]*')]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9 ]*')]],

  })
  // form control passing to html file

  register(){
    if(this.registerForm.valid){
      console.log(this.registerForm.value);
    let username=this.registerForm.value.username
    let acno=this.registerForm.value.acno
    let password=this.registerForm.value.password
    console.log(username,acno,password);
    //  api call for register
    this.api.register(username,acno,password).subscribe((response:any)=>{
      console.log(response);
      alert(response.message);
      this.RegisterSuccess=response.message;

      setTimeout(()=>{
        // redirected to login page
      this.loginRouter.navigateByUrl('')

      },3000)
      

      
    },
    (response:any)=>{
      this.RegisterError=response.error.message;//error message
      setTimeout(()=>{
        this.registerForm.reset();
        this.RegisterError="";

      },3000)
    }

    )
    // alert('Register Clicked')
    }
    else{
      alert('Invalid Form')
    }
 
    
    
    
  }
}
