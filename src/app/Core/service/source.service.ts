import { HttpClient } from '@angular/common/http';
import { GlobalAPiService } from './global-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SourceService {

  constructor(private Url:GlobalAPiService , private _HttpClient:HttpClient ) { }


  getAll(numpage:number=1 ,pageSize:number=10 ):Observable<any>{
    return this._HttpClient.get(`${this.Url.baseUrl}${this.Url.sourceRoute}/paginate?pageNumber=${numpage}&pageSize=${pageSize}&orderBeforPagination=true`)
  }
  
  getSourceById(SourceId: string): Observable<any>{
      return this._HttpClient.get(`${this.Url.baseUrl}${this.Url.sourceRoute}?id=${SourceId}`);
    
  }
    
  
  deleteSource(SourceId: string): Observable<any> {
    return this._HttpClient.delete(`${this.Url.baseUrl}${this.Url.sourceRoute}?id=${SourceId}`)
  }

  addSource(dataSource:any): Observable<any> {
    return this._HttpClient.post(`${this.Url.baseUrl}${this.Url.sourceRoute}` , dataSource, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateSource( dataSource: any): Observable<any> {
    return this._HttpClient.put(`${this.Url.baseUrl}${this.Url.sourceRoute}` , dataSource,{
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }}
