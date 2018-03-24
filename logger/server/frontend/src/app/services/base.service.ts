import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class BaseService {

  protected basePath: string = environment.baseURL;
  protected snackbarConfig: any = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  constructor(
    protected http: HttpClient,
    protected snackbar: MatSnackBar
  ) {}

  /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
  */

  protected handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  protected log(message: string) {
    // this.messageService.add('HeroService: ' + message);
    /* */
    this.snackbar.open('Error. Check console for more info.', '', this.snackbarConfig);
    console.log('Service : ' + message);
  }

  protected interpolateURI(args) {
    /*
      forming the basepath
    */
    let path = this.basePath;
    if (args.basePath) {
      path = args.basePath;
    }

    /*
      concatinating multiple string to form one string
    */
    path = args.paths.reduce((acc, path) => acc.concat(path), path);

    /*
      interpolating the params to the path (template)
      eg : 
      'http://example.com/customers/{id}'
        can be interpolated to
      'http://example.com/customers/12'
      if params is passed like { 'id' : 12 }
    */
    if (args.params) {
      Object.keys(args.params).forEach((templateKey) => {
        let regex = new RegExp("{" + templateKey + "}");
        path = path.replace(regex, args.params[templateKey]);
      });
    }

    return path;
  }

}
