import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  deleteSuccessMsg:string='';

  deleteConfirmStatus:boolean = false;//delete confirmation

  acno:any//for parent to child data communication

  user: String = ''//to hold the current user name
  balance: string = '';
  currentAcno: string = '';
  foundTransferSuccess ='';
  foundTransferError = '';
  success:any;
  logoutSucess:any;

  isCollapse: boolean = false
  collapse() {
    this.isCollapse = !this.isCollapse
  }
  constructor(private fb: FormBuilder, private api: ApiService,private logoutRouter:Router) {

  }
  ngOnInit(): void {

   if(!localStorage.getItem("token")){
    alert("Please login")
    this.logoutRouter.navigateByUrl('')
   }

    if (localStorage.getItem('currentUser')) {
      this.user = localStorage.getItem('currentUser') || '';//currentuser
    }
    // if(localStorage.getItem('balance')){
    //   this.balance=localStorage.getItem('balance')||'';//balance
    // }
    if (localStorage.getItem('currentAcno')) {
      this.currentAcno = localStorage.getItem('currentAcno') || '';//currentAcno
    }
  }

  foundTransfer = this.fb.group({
    acno: ['', [Validators.required, Validators.pattern('[0-9 ]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9 ]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],

  })

  // transfer(){
  //   if(this.foundTransfer.valid){
  //     console.log(this.foundTransfer.value);
  //     let acno=this.foundTransfer.value.acno
  //     let amount=this.foundTransfer.value.amount
  //     let password=this.foundTransfer.value.password
  //     console.log(acno,amount,password);

  //   }
  // }

  dashboardForm() {
    if (this.foundTransfer.valid) {
      let creditAc = this.foundTransfer.value.acno;
      let password = this.foundTransfer.value.password;
      let amount = this.foundTransfer.value.amount;

      this.api.fundtransfer(creditAc, password, amount).subscribe((result: any) => {
        console.log(result);
        this.foundTransferSuccess=result.message;
        setTimeout(()=>{
          this.foundTransferSuccess=''
          this.foundTransfer.reset();

        },2000)

      },
        (result: any) => {
          console.log(result.error.message);
          this.foundTransferError=result.error.message
          setTimeout(()=>{
            this.foundTransferError=''
            this.foundTransfer.reset();
  
          },2000)
        }
        
      );
    }
    else {
      alert('Please Enter Valid Parameter')
    }
  }

  getBalance() {
    this.api.getBalance(this.currentAcno).subscribe((result: any) => {
      this.balance = result.balance;
    },
      (result: any) => {
        alert(result.error.message);
      }
    );
  }
  
  reset(){
    this.foundTransfer.reset()
    
   }
  

  logout(){
  this.logoutSucess=true
  setTimeout(()=>{
    this.logoutRouter.navigateByUrl('')
  },6000)   
  localStorage.clear()
 

  } 
  deleteAccount(){
    //data to be shared with the child
    this.acno=localStorage.getItem('currentAcno')

    this.deleteConfirmStatus=true
  }

  cancelDeleteConfirm(){
   this.acno=''
   this.deleteConfirmStatus=false
    
  }
  deleteFromParent(){
    this.api.deleteAccount().subscribe((result:any)=>{
      localStorage.clear()//remove all the accounts details from the local storage
      this.deleteSuccessMsg=result.message//Account deleted Successfully
      setTimeout(()=>{
        this.logoutRouter.navigateByUrl('')//redirect back to login page
      },3000)
      })
      
  }
}
