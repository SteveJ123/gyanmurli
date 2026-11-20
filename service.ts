import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type SupportedLang = 'telugu' | 'hindi' | 'english';

export interface MurliDateRow {
  id: number;
  language: SupportedLang;
  year: number;
  murli_date: string;
  text_html_url: string | null;
  text_pdf_url: string | null;
  essence_html_url: string | null;
  essence_pdf_url: string | null;
  audio_mp3_url: string | null;
  audio_mp4_url: string | null;
}

@Injectable({ providedIn: 'root' })
export class Service {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/murli';

  getMurliByLangAndYear(lang: any, year: any): Observable<MurliDateRow[]> {
    return this.http.get<MurliDateRow[]>(`${this.apiUrl}/${lang}/${year}`);
  }

  createMurliEntry(formData: any): Observable<{ message: string; data: MurliDateRow }> {
    return this.http.post<{ message: string; data: MurliDateRow }>(this.apiUrl, formData);
  }
}