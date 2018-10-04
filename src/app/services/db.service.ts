import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DbService {
  protected apiRoot = 'http://localhost:80/EssentiaPharma/';

  constructor(private http: Http) { }

  public post(service_page: string, parameters: any = {}, options: any = {}): Observable<any> {
    const url = `${this.apiRoot}${service_page}.php`
    return (this.http.post(url, parameters, options))
  }

}
