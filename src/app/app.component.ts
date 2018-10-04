import { Component, OnInit, ViewChild} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatAccordion} from "@angular/material";
import { DbService } from './services/db.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

interface data {
  id: string,
  name: string,
  tel: string,
  email: string,
  photo: string,
  adress: string,
  obs: string,
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public data: data;
  public editData: data;
  public insertData: data;
  public loading = false;
  public letEdit = false;
  public imgHost = 'http://localhost/EssentiaPharma/fotos/';
  public letInsert = false;
  public uploading = false;
  public fileUploaded = false;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  nameFormControl = new FormControl('', [
    Validators.required,
  ]);
  photoFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new MyErrorStateMatcher();

  constructor (private db: DbService) {

  }

  load() {
    this.loading=true;
    this.data = null;
    this.db.post('lista-clientes','').subscribe(
      res => {
        this.loading=false;
        this.data = res.json()
      },
    )
  }

  edit(lineData){
    this.editData = lineData;
    this.letEdit = true;
  }

  newClient(){
    this.loading=true;
    this.insertData = null;
    this.editData = null;
    this.letInsert = false;
    this.db.post('insert-cliente').subscribe(
      res => {
        this.insertData = res.json()[0];
        this.letInsert = true;
        this.loading=false;
      },
    )
  }

  cancelEdit(lineData){
    this.load();
    this.letInsert = false;
  }

  saveEdit(lineData){
      this.loading=true;
      this.letInsert = false;
      this.data = null;
      this.db.post('edit-cliente',lineData).subscribe(
        res => {
          this.load();
        },
      )
    // }
  }

  openFile(id){
    document.getElementById("photo"+id).click();
  }

  fileSelected(event,actualData){
    this.uploading = true;
    let file,reset : File;
    const fd = new FormData();
    file = event.target.files[0];
    reset = void

    fd.append('image', file, file.name);
    fd.append('headers', 'Content-Type', 'multipart/form-data');
    this.db.post('salvar-foto',fd,{},'id=' + actualData.id).subscribe(
      res => {
        const ext = '.' + file.name.split('.').pop();
        actualData.photo = actualData.id + ext;
        event.srcElement.value = '';
        this.uploading = false;
      }
    );
  }

  delete(lineData){
    if (confirm(`Deseja excluir o registro de ${lineData.name}`)){
      const param: any = {
        id: lineData.id
      }
      this.loading=true;
      this.data = null;
      this.db.post('delete-cliente',param).subscribe(
        res => {
          this.load()
        },
      )
    }
  }

  panelClosed(){
    this.letEdit=false;
    this.editData = null;
    this.letInsert=false;
    this.insertData=null;
  }

  ngOnInit(){
    this.load();
  }

}
