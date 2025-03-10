import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KmapGeneratorService {

  // private checkUserAPIURL = 'http://127.0.0.1:8000/user';
  // private checkGameAPIURL = 'http://127.0.0.1:8000/game';

  private checkUserAPIURL = 'https://kmap-gameee-backend.vercel.app/user';
  private checkGameAPIURL = 'https://kmap-gameee-backend.vercel.app/game';

  constructor(private http: HttpClient) { }

  // get(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  postCheckUser(item: any): Observable<any> {
    return this.http.request('post', this.checkUserAPIURL, { body: item });
    // return this.http.post<any>(this.apiUrl, item);
  }

  getcheckAnswer(item: any): Observable<any> {
    return this.http.request('get', this.checkGameAPIURL, { body: item });
    // return this.http.post<any>(this.apiUrl, item);
  }

  postCheckAnswer(item: any): Observable<any> {
    return this.http.request('post', this.checkGameAPIURL, { body: item });
    // return this.http.post<any>(this.apiUrl, item);
  }
}
