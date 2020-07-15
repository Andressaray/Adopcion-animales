import { BrowserModule }        from '@angular/platform-browser';
import { BrowserAnimationsModule }    from '@angular/platform-browser/animations';
import { NgModule }             from '@angular/core';
import { FormsModule,ReactiveFormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule }     from '@angular/common/http';

import { MatInputModule  }      from '@angular/material/input';
import { TextFieldModule }      from '@angular/cdk/text-field';
import { MatSelectModule }      from '@angular/material/select';
import { PlatformModule }       from '@angular/cdk/platform';
import { AngularFileUploaderModule }     from 'angular-file-uploader';

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
  { path:  '',         component: IndexComponent },
  { path:  'index',    component: IndexComponent }, 
  { path:  'pets',     component: PetsComponent },
  { path:  'login',    component: LoginComponent },
  { path:  'register', component: RegisterComponent },
  { path:  'logout',   component: LogoutComponent },
  { path:  '**',       component: ErrorComponent }
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
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TextFieldModule,
    MatSelectModule,
    MatInputModule,
    PlatformModule,
    FormsModule,
    AngularFileUploaderModule,
    AppRoutingModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
