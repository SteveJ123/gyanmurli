import { Routes } from '@angular/router';
import { Home } from '../components/home/home';
import { LanguageYear } from '../components/language-year/language-year';

export const routes: Routes = [
    {path: "", component: Home},
    { path: ':lang', component:  LanguageYear}
];
