import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';
import { OrderProcessComponent } from './order-process/order-process.component';
import { ChoosePaymentMethodComponent } from './choose-payment-method/choose-payment-method.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'register', pathMatch: 'full', component: RegisterFormComponent },
  {
    path: 'order-success',
    pathMatch: 'full',
    component: OrderSuccessComponent,
  },
  {
    path: 'order-history',
    pathMatch: 'full',
    component: OrderHistoryComponent,
  },
  { path: 'logout', pathMatch: 'full', component: LogoutComponent },
  {
    path: 'order-process',
    pathMatch: 'full',
    component: OrderProcessComponent,
  },
  {
    path: 'payment-method',
    pathMatch: 'full',
    component: ChoosePaymentMethodComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
