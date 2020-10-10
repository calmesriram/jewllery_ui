import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import { FormGroup, FormControl,FormBuilder,Validators } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { ApiService } from '../api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

var ELEMENT_DATA: any = [];
@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  displayedColumns:any = ['position','productname','rate','Delete'];  
  dataSource = new MatTableDataSource(ELEMENT_DATA);  
  countryCtrl: FormControl;
  productForm: FormGroup;
  gstForm: FormGroup;
  selectedproditem:any=[];
  countryCtrl2: FormControl;
  country_lis:any=[];
  country_lis2:any=[];
  filteredCountry: Observable<any[]>;
  filteredCountry2: Observable<any[]>;
  value = '';
  value2 = '';
  cus_address:any;
cus_adhaarid:any;
cus_customername:any;
cus_emailid:any;
cus_phonenumber:any; 
  filteredOptions: Observable<string[]>;
  filteredOptions2: Observable<string[]>;
proditem;

  constructor(public api:ApiService,public formBuilder: FormBuilder) { 
    this.countryCtrl = new FormControl();
    this.countryCtrl2 = new FormControl();
    this.filteredCountry = this.countryCtrl.valueChanges
      .pipe(
        startWith(''),
        map(country => country ? this.filtercountry(country) : this.country_lis.slice())
    );
    this.filteredCountry2 = this.countryCtrl2.valueChanges
    .pipe(
      startWith(''),
      map(country => country ? this.filtercountry2(country) : this.country_lis2.slice())
  );
  }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      productname: ['', Validators.required],
      rate: ['', Validators.required],
      // qty: ['', Validators.required]
    
      
  });
  this.gstForm = this.formBuilder.group({
    totamt: ['', Validators.required],
    taxamt: ['', Validators.required],
    tottaxpercent: ['', Validators.required],
    cgsttax: ['', Validators.required],
    sgsttax: ['', Validators.required],
    roundoff: ['', Validators.required],
    totamtwithtax: ['', Validators.required]
  })
    this.getcustomer();
    this.getproduct();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;       
      this.dataSource.filter = filterValue.trim().toLowerCase();
      console.log(this.dataSource.filter) 
  }

  filtercountry(name: string) {
    return this.country_lis.filter(country => 
      country.customername.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  filtercountry2(name: string) {
    return this.country_lis2.filter(country => 
      country.productname.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  test(para){  
    this.cus_address = para.address
    this.cus_adhaarid =para.adhaarid;
    this.cus_customername = para.customername;
    this.cus_emailid = para.emailid
    this.cus_phonenumber = para.phoneumber
    // console.log(para);

  }
  prod(item){
    // console.log(item)    
    this.proditem = "";    
    this.proditem = item;
    // this.proditem = this.productForm.controls.qty.setValue(0);
    this.productForm.controls.productname.setValue(item.productname);
    // this.productForm.controls.qty.setValue(0);   
    
  }
  getTotalAmount() {
    return this.selectedproditem.map(t => t.rate).reduce((acc, value) => acc + value, 0);
  }
  getcustomer(){
    this.api.Getcustomer().then((data:any) =>{
      console.log(data.data.length)
      if(data.data.length == 0){
         this.api.snackmsg("No Record(s) Found","Close")
      }
      if( data.status == true && data.data.length != 0){
        console.log(data)  
        this.country_lis = data.data       
     }
  console.log(data);
  
    }).catch(err =>{
      // this.api.snackmsg("Hail","close")
    })
  }
  getproduct(){  
    this.api.Getproduct().then((data:any) =>{    
    if(data.data.length == 0){
       this.api.snackmsg("No Record(s) Found","Close")
    }
    if( data.status == true && data.data.length != 0){
      this.country_lis2 = data.data   
      console.log(data.data)           
    }
    console.log(data)         
}).catch(err =>{
    // this.api.snackmsg("Hail","close")
  })
}

add() { 
  this.proditem.rate = this.productForm.controls.rate.value
this.selectedproditem.push(this.proditem);
this.productForm.reset();
console.log(this.selectedproditem)
this.value2=""
this.tabledata();
   
}
taxcalc(){
  let taxamount =0;
  let tax_cgst_sgst =0;
  let totalamount_withtax = 0;
  let totalamount = 0;
  
  this.gstForm.controls.totamt.setValue(this.getTotalAmount());  
  totalamount = this.gstForm.controls.totamt.value
  taxamount = (totalamount * (0.03));
  // console.log(taxamount)
   tax_cgst_sgst = (taxamount / 2);
   totalamount_withtax = totalamount + taxamount;
  this.gstForm.controls.tottaxpercent.setValue(3);
  this.gstForm.controls.taxamt.setValue(taxamount);
  this.gstForm.controls.cgsttax.setValue(tax_cgst_sgst);
  this.gstForm.controls.sgsttax.setValue(tax_cgst_sgst);
  this.gstForm.controls.totamtwithtax.setValue(totalamount_withtax);  
  this.gstForm.controls.roundoff.setValue(Math.round(totalamount_withtax));
  
}
tabledata(){
  console.log(this.getTotalAmount())
  console.log(this.selectedproditem)
  this.dataSource = new MatTableDataSource(this.selectedproditem);
}
remove(dat){
  // console.log(dat);    
    let index = this.selectedproditem.indexOf(dat);
    if (index > -1) {
      this.selectedproditem.splice(index, 1);
    }
  
  this.tabledata();
}
}
