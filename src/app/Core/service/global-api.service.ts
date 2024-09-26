import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalAPiService {


  baseUrl: string = 'https://meilisync.runasp.net/meilisync/api/v1';
  meilisearchRoute: string = '/meilisearch';
  syncRoute: string = '/sync';
  sourceRoute: string = '/source';



  constructor() { }


}

