import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

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
  private readonly apiUrl = 'http://localhost:5000/api/';
  // private readonly apiUrl = 'https://apigyanmurli.younghappyandhealthy.com/api/';

  private readonly tokenKey = 'auth_token';

  getMurliByLangAndYear(lang: any, year: any): Observable<MurliDateRow[]> {
    return this.http.get<MurliDateRow[]>(`${this.apiUrl}murli/${lang}/${year}`);
  }

  createMurliEntry(formData: any): Observable<any> {
    return this.http.post<{ message: string; data: MurliDateRow }>(`${this.apiUrl}murli`, formData);
  }

  register(mobile: string, password: string, language:any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}auth/register`, { mobile, password, language })
      .pipe(tap((res) => this.saveToken(res, true)));
  }

  login(mobile: string, password: string, rememberMe = true): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}auth/login`, { mobile, password })
      .pipe(tap((res) => this.saveToken(res, rememberMe)));
  }

  saveToken(res: any, persist = true): void {
    console.log("res", res.user.language)
    if (!res.token) return;
    if (persist) {
      localStorage.setItem(this.tokenKey, res.token);
      localStorage.setItem('language', res.user.language)
      sessionStorage.removeItem(this.tokenKey);
    } else {
      sessionStorage.setItem(this.tokenKey, res.token);
      localStorage.removeItem(this.tokenKey);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }

  private getAuthHeaders(): any {
  const token = localStorage.getItem('auth_token') || '';
  return new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
}

updateMurliEntry(id: number, payload: any) {
  return this.http.put<{ message: string; data: any }>(
    `${this.apiUrl}murli/${id}`,
    payload,
    { headers: this.getAuthHeaders() }
  );
}

deleteMurliEntry(id: number) {
  return this.http.delete<{ message: string; id: number }>(
    `${this.apiUrl}murli/${id}`,
    { headers: this.getAuthHeaders() }
  );
}
}