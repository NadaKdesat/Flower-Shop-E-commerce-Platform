import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components from 'adnan'
import { NavComponent } from './adnan/nav/nav.component';
import { FooterComponent } from './adnan/footer/footer.component';
import { LoginComponent } from './adnan/login/login.component';
import { RegisterComponent } from './adnan/register/register.component';
import { ContactComponent } from './adnan/contact/contact.component';
import { HomeComponent } from './adnan/home/home.component';
import { AboutComponent } from './adnan/about/about.component';
import { FeedbackComponent } from './mona/feedback/feedback.component';
import { UsersComponent } from './mona/users/users.component';
import { VouchersComponent } from './mona/vouchers/vouchers.component';
import { DashboardComponent } from './mona/dashboard/dashboard.component';

// Components from 'amal'
import { ProfileandeditComponent } from './amal/profileandedit/profileandedit.component';
import { HistoryComponent } from './amal/history/history.component';

// Components from 'Toqa' (Ensure all paths are unified)
import { AddCategoryComponent } from './Toqa/add-category/add-category.component';
import { EditCategoryComponent } from './Toqa/edit-category/edit-category.component';
import { AddProductComponent } from './Toqa/add-product/add-product.component';
import { ShowAllCategoryComponent } from './Toqa/show-all-category/show-all-category.component';
import { HabibComponent } from './habib/habib/habib.component';
import { SidebarComponent } from './mona/sidebar/sidebar.component';
import { DashboardcontentComponent } from './mona/dashboardcontent/dashboardcontent.component';
import { ShowallproductsComponent } from './Toqa/showallproducts/showallproducts.component';
import { OrdersComponent } from './Toqa/orders/orders.component';
import { OrderComponent } from './ali/order/order.component';
import { VerifyCodeComponent } from './habib/verify-code/verify-code.component';
import { NewPasswordComponent } from './habib/new-password/new-password.component';
import { ResetPasswordComponent } from './habib/reset-password/reset-password.component';
import { ProductDetailsComponent } from './nada/product-details/product-details.component';
import { ProductsComponent } from './nada/products/products.component';
import { CartComponent } from './ali/cart/cart.component';
import { CheckoutComponent } from './ali/checkout/checkout.component';
import { ChatComponent } from './ali/chat/chat.component';
import { AdminChatComponent } from './ali/admin-chat/admin-chat.component';
import { VoucherComponent } from './ali/voucher/voucher.component';
import { LoginPhotoComponent } from './ali/login-photo/login-photo.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ContactComponent,
    HomeComponent,
    AboutComponent,
    DashboardComponent,
    FeedbackComponent,
    UsersComponent,
    VouchersComponent,
    ProfileandeditComponent,
    HistoryComponent,
    CartComponent,
    CheckoutComponent,
    VoucherComponent,
    DashboardComponent,
   
    DashboardComponent,
    
    AddCategoryComponent,
    EditCategoryComponent,
    AddProductComponent,
    ShowAllCategoryComponent,
    HabibComponent,
    EditCategoryComponent,
    AddProductComponent,
    SidebarComponent,
    DashboardcontentComponent,
    ShowallproductsComponent,
    OrdersComponent,
    HabibComponent,
    OrderComponent,
    VerifyCodeComponent,
    NewPasswordComponent,
    ResetPasswordComponent,
    HabibComponent,
    ProductDetailsComponent,
    ProductsComponent,
    ChatComponent,
    AdminChatComponent,
    LoginPhotoComponent
  ],
  imports: [
    BrowserModule,
   
    AppRoutingModule,
    FormsModule,
    BrowserModule, HttpClientModule,
    AppRoutingModule,
   
  
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
