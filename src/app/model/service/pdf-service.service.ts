import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PdfServiceService {
  private apiKey = 'guirogeriobertagna00@gmail.com_7p2aFmO5G4e9HDKER1pESzwXfMUu2l8C98Sy6386428WFyBsddtP6090K3fyZJIT';
  private apiUrl = 'https://api.pdf.co/v1/pdf/info';
  private extractCoverUrl = 'https://api.pdf.co/v1/pdf/convert/to/png';

  constructor(private http: HttpClient) { }

  getPdfInfo(uploadedFileUrl: string): Observable<{ pages: number; author: string }> {
    const payload = { url: uploadedFileUrl };
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, payload, { headers }).pipe(
      map(response => ({
        pages: response.info?.PageCount || 0,
        author: response.info?.Author || 'Unknown'
      }))
    );
  }

  extractCover(uploadedFileUrl: string): Observable<Blob> {
    const payload = { url: uploadedFileUrl, pages: '0' };
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.extractCoverUrl, payload, { headers }).pipe(
      switchMap(response => {
        const coverImageUrl = response?.urls?.[0] || '';
        return this.downloadCoverImage(coverImageUrl);
      })
    );
}

  downloadCoverImage(coverImageUrl: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
    });

    return this.http.get(coverImageUrl, { headers, responseType: 'blob' });
  }
}
