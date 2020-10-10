import {AfterViewInit, Component, ViewChild,OnInit} from '@angular/core';
import { ApiService } from '../api.service';
import { FormGroup, FormControl,FormBuilder,Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

var ELEMENT_DATA: any = [];
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  displayedColumns:any = ['customername', 'phoneumber','adhaarid','address','emailid'];
  // customertable;
  dataSource = new MatTableDataSource(ELEMENT_DATA);  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  
  customerForm: FormGroup;
  constructor(public api:ApiService,public formBuilder: FormBuilder) { }
  // profileForm:FormControl
  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      customername: ['', Validators.required],
      phoneumber: ['', Validators.required],
      emailid: ['', Validators.required],
      adhaarid: ['', Validators.required],
      date: ['', Validators.required],
      address: ['', Validators.required]      
  });

    this.getcustomer();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;       
      this.dataSource.filter = filterValue.trim().toLowerCase();
      console.log(this.dataSource.filter) 
  }
  
  getTotalCost() {
    // return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }
getcustomer(){
  this.api.Getcustomer().then((data:any) =>{
    console.log(data.data.length)
    if(data.data.length == 0){
       this.api.snackmsg("No Record(s) Found","Close")
    }
    if( data.status == true && data.data.length != 0){
      console.log(data)
      // this.customertable = data.data
      this.dataSource = new MatTableDataSource(data.data);
   }
console.log(data);

  }).catch(err =>{
    // this.api.snackmsg("Hail","close")
  })
}

onSubmit() {
  console.warn(this.customerForm.value);
  this.api.Postcustomer(this.customerForm.value).then((data)=>{
    console.log(data)
    this.getcustomer();
  }).catch(e =>{
    console.log(e)
    this.getcustomer();
  })
  
}
}



