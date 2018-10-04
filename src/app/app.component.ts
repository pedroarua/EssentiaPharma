import { Component, OnInit} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import { DbService } from './services/db.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

interface data {
  id: number,
  name: string,
  tel: string,
  email: string,
  photo: ByteString,
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

  public data: data;
  public editData: data;
  public loading = false;
  public letEdit = false;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  constructor (private db: DbService) {}

  load() {
    this.loading=true;
    this.data = null;
    this.db.post('lista-clientes','').subscribe(
      res => {
        this.loading=false;
        this.data = res.json()
        // console.info(this.data)
      },
    )
  }

  edit(lineData){
    this.editData = lineData;
    this.letEdit = true;
  }

  saveEdit(lineData){
    // console.info(lineData);
    this.loading=true;
    this.data = null;
    this.db.post('edit-cliente',lineData).subscribe(
      res => {
        console.info(res)
        this.load();
      },
    )
  }

  openFile(id){
    document.getElementById("photo"+id).click();
  }

  fileSelected(event,id){
    let file : File;
    const fd = new FormData();
    file = event.target.files[0];

    fd.append('image', file, file.name);
    fd.append('headers', 'Content-Type', 'multipart/form-data');

    console.info(fd);

    this.db.post('salvar-foto',fd).subscribe(
      res => {
        console.info(res);
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

  ngOnInit(){
    this.load();
  }

}
