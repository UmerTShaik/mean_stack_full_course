import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  userIsAuthenticated = false;
  private authListenerSubs:Subscription;

  constructor(private authService:AuthService){}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();//since header copmonent is gettinglodaed later thatn app componennt for autologin so we are still seeing login buton on UI
      //hear token status for logout button
      this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(
        isAuthenticated =>{
          this.userIsAuthenticated = isAuthenticated;
        }
      );
  }

  onLogout(){
    this.authService.logout();
  }



  ngOnDestroy(): void {
      this.authListenerSubs.unsubscribe();
  }
}
