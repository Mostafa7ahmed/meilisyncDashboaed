  import { HttpClient } from '@angular/common/http';
  import { GlobalAPiService } from './global-api.service';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AsynService {

  constructor(private Url:GlobalAPiService , private _HttpClient:HttpClient ) { }
  getAll(numpage:number=1 ,pageSize:number=10 ):Observable<any>{
    return this._HttpClient.get(`${this.Url.baseUrl}${this.Url.syncRoute}/paginate?pageNumber=${numpage}&pageSize=${pageSize}&orderBeforPagination=true`)
  }
  
  getSyncById(melieId: string): Observable<any>{
      return this._HttpClient.get(`${this.Url.baseUrl}${this.Url.syncRoute}?id=${melieId}`);
    
  }
    
  
  deleteSync(melieId: string): Observable<any> {
    return this._HttpClient.delete(`${this.Url.baseUrl}${this.Url.syncRoute}?id=${melieId}`)
  }

  addSync(datamelie:any): Observable<any> {
    return this._HttpClient.post(`${this.Url.baseUrl}${this.Url.syncRoute}` , datamelie);
  }

  updateSync( datamelie: any): Observable<any> {
    return this._HttpClient.put(`${this.Url.baseUrl}${this.Url.syncRoute}` , datamelie,{
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
