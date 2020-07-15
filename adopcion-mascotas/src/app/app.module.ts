import { BrowserModule }        from '@angular/platform-browser';
import { NgModule }             from '@angular/core';
import { FormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule }     from '@angular/common/http';

import { AppComponent }         from './app.component';
import { LoginComponent }       from './auth/login/login.component';
import { RegisterComponent }    from './auth/register/register.component';
import { LogoutComponent }      from './auth/logout/logout.component';
import { ErrorComponent }       from './auth/error/error.component';
import { PetsComponent }        from './auth/pets/pets.component';
import { IndexComponent }       from './auth/index/index.component';
import { AppRoutingModule }     from './app-routing.module';
import { AuthService }          from './services/auth.service';
import { HeaderComponent }      from './auth/header/header.component';

const routes: Routes = [
  { path:  '',              component:  IndexComponent },
  { path: 'auth/index',     component: IndexComponent }, 
  { path:  'auth/pets',     component: PetsComponent },
  { path:  'auth/login',    component: LoginComponent },
  { path:  'auth/register', component: RegisterComponent },
  { path:  'auth/logout',   component: LogoutComponent },
  { path:  '**',            component:  ErrorComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ErrorComponent,
    PetsComponent,
    IndexComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
