import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService:AuthService){}

    intercept(req:HttpRequest<any> , next:HttpHandler){
        const  authToken = this.authService.getToken();
        const authRequest = req.clone({//add header to exisitng headers
            headers: req.headers.set('Authorization',"Bearer " + authToken)//its authorization in middleware caps doesnt matter
        })
        return next.handle(authRequest);
    }
}