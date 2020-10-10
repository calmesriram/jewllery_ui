import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
public baseurl:String= "http://localhost:3000"
  constructor(public _snackBar: MatSnackBar,public http: HttpClient) {

  }
  Postcustomer(data){
    return new Promise((resolve,reject) => {
      this.http.post(this.baseurl+"/Customer",data).subscribe(res => {
        resolve(res);
      }, err => {
        resolve(err);
      })
    })
  }

Getcustomer(){
  return new Promise((resolve,reject) => {
    this.http.get(this.baseurl+"/Customer").subscribe(res => {
      resolve(res);
    }, err => {
      resolve(err);
    })
  })
}

GetcustomerbyId(id){
  return new Promise((resolve,reject) => {
    this.http.get(this.baseurl+"/Customer/"+id).subscribe(res => {
      resolve(res);
    }, err => {
      resolve(err);
    })
  })
}

Postproduct(data){
  return new Promise((resolve,reject) => {
    this.http.post(this.baseurl+"/Product",data).subscribe(res => {
      resolve(res);
    }, err => {
      resolve(err);
    })
  })
}

Getproduct(){
return new Promise((resolve,reject) => {
  this.http.get(this.baseurl+"/Product").subscribe(res => {
    resolve(res);
  }, err => {
    resolve(err);
  })
})
}

GetproductbyId(id){
return new Promise((resolve,reject) => {
  this.http.get(this.baseurl+"/Product/"+id).subscribe(res => {
    resolve(res);
  }, err => {
    resolve(err);
  })
})
}

  snackmsg(message: string, action ?: string){
    
      this._snackBar.open(message, action, {
        duration: 5000,
      });
    }

  
  
}
