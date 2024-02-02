import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl +"/user/";

@Injectable({providedIn:'root'})
export class AuthService{
    //instead of behavior subject fo post list comp to set button edit and delte according to 
    //token but login only then we push status and post list is created once after login is
    // done and nothing to emit, so post list wont have info
    private isAuthenticated = false;

    private token: string;
    private authStatuListener = new Subject<boolean>();//to push token if its active or expired for header logout button
    private tokenTimer:any;//manaully clear timtout so old timer doesnt run in background when loggin in 

    private userId: string;//adding this to get fetched sued id so only guy who created can see button to edit and delete

    constructor(private http: HttpClient , private router:Router){}

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    getAuthStatusListener(){
        return this.authStatuListener.asObservable();
    }

    getUserId(){
        return this.userId;
    }

    createUser(email:string , password:string){
        const authData: AuthData = {email :email , password : password}
        this.http.post(BACKEND_URL+"/singup", authData)
        .subscribe((res) =>{
            //console.log(res);
            this.router.navigate['/'];
        }, error =>{
            this.authStatuListener.next(false);//only for spinner
        } );
    }

    login(email:string , password:string){
        const authData: AuthData = {email :email , password : password}
        this.http.post<{token:string , expiresIn: string , userId:string}>(BACKEND_URL+"/login" , authData)
        .subscribe(response =>{
            const token = response.token;
            this.token = token;
            if(token){
            const expiresInDuration:any = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatuListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration *1000) ;
            console.log(expirationDate)
            this.saveAuthData(token,expirationDate , this.userId);
            this.router.navigate(['/']);
            }
            
        } , error =>{
            this.authStatuListener.next(false);
        });
    }

    autoAuthUser(){//auto login
       const authInformation =  this.getAuthData();
       if(!authInformation){
        return;
       }
       const now = new Date();
       const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
       console.log(authInformation, expiresIn)
       if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatuListener.next(true);
        }
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatuListener.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
        
    }

    private setAuthTimer(duration :number){
        console.log("setting timer:" +duration)
        this.tokenTimer = setTimeout(()=>{
            this.logout();
        } , duration * 1000);//timout is in millieseconds
    }

    private saveAuthData(token:string , expirationDate:Date , userId:string){
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem("userId", userId)
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration")
        localStorage.removeItem("userId")
    }

    private getAuthData(){//for authnticatin if user is already logged in for auto login 
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration")
        const userId = localStorage.getItem("userId")
        if(!token && !expirationDate){
            return null;
        }

        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId:userId
        }
    }
}