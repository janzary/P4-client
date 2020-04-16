import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent} from './components/admin/admin.component';
import { CheckoutComponent} from './components/checkout/checkout.component';
import { HomeComponent} from './components/home/home.component';
import { RegisterComponent} from './components/register/register.component';
import { Register2Component } from './components/register2/register2.component'
import { ShopComponent} from './components/shop/shop.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AdminAuthGuard } from './guards/admin-auth.guard'; 



const routes: Routes = [
  {path:'admin', component: AdminComponent, canActivate:[AdminAuthGuard] },
  {path:'checkout', component: CheckoutComponent},
  {path:'register', component: RegisterComponent},
  {path:'register-next', component: Register2Component},
  {path:'shop', component: ShopComponent},
  {path:'', pathMatch: 'full', component: HomeComponent},
  {path: 'login', redirectTo: "/" },
  {path:'home', redirectTo: "/shop"},
  {path:'**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
