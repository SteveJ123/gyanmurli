import { Routes } from '@angular/router';
import { Home } from '../components/home/home';
import { LanguageYear } from '../components/language-year/language-year';
import { DatesComponent } from '../components/dates-component/dates-component';
import { Login } from '../components/login/login';

export const routes: Routes = [
    {path: "", component: Home},
    { path: 'lang/:lang', component:  LanguageYear},
    { path: ':lang/:year', component:  DatesComponent},
    {path: "login", component: Login},
];
