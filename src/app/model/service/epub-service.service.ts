import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EpubServiceService {



  constructor(private http: HttpClient) { }

  async convertEpubToPdf(epubUrl: string){
   
  
  }
}
