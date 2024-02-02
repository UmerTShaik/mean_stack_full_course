import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { catchError, throwError } from "rxjs";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    constructor(private dialog:MatDialog){}

    intercept(req:HttpRequest<any> , next:HttpHandler){
       
        return next.handle(req).pipe(
           
            catchError((error:HttpErrorResponse) =>{
                let errorMessage = "An unknown error occured"
                if(error.error.message){
                    errorMessage = error.error.message
                }
                this.dialog.open(ErrorComponent , {data: { message: errorMessage }});
                        //here have to return obervable
                return throwError(error)//thowirn observable from rxjs
            })
        );//handle usually gives the response observable stream so use it, use piep opertaor to use catchError operator
    }
}