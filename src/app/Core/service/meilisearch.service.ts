  import { HttpClient } from '@angular/common/http';
  import { GlobalAPiService } from './global-api.service';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class MeilisearchService {

    constructor(private Url:GlobalAPiService , private _HttpClient:HttpClient ) { }


    getAll(numpage:number=1 ,pageSize:number=10 ):Observable<any>{
      return this._HttpClient.get(`${this.Url.baseUrl}${this.Url.meilisearchRoute}/paginate?pageNumber=${numpage}&pageSize=${pageSize}`)
    }
    
    getMeileById(melieId: string): Observable<any>{
        return this._HttpClient.get(`${this.Url.baseUrl}${this.Url.meilisearchRoute}?id=${melieId}`);
      
    }
      
    
    deleteMeile(melieId: string): Observable<any> {
      return this._HttpClient.delete(`${this.Url.baseUrl}${this.Url.meilisearchRoute}?id=${melieId}`)
    }

    addMeile(datamelie:any): Observable<any> {
      return this._HttpClient.post(`${this.Url.baseUrl}${this.Url.meilisearchRoute}` , datamelie);
    }

    updateMelie( datamelie: any): Observable<any> {
      return this._HttpClient.put(`${this.Url.baseUrl}${this.Url.meilisearchRoute}` , datamelie,{
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
