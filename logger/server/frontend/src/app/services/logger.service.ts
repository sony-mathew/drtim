import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { catchError } from 'rxjs/operators';

@Injectable()

export class LoggerService extends BaseService {

  private logsPath: string = '/logs';
  private logPath: string = '/logs/{id}';

  show(id: number | string) {
    let url = this.getURL(id);
    return this.http.get(url).pipe(catchError(this.handleError('Show One Log', {})));
  }

  paginate(page: number = 1) {
    return this.http.get(`${this.basePath}${this.logsPath}?page=${page}`).pipe(catchError(this.handleError('Logs', {})));
  }

  private getURL(id: string | number) {
    id = id.toString();
    let url = this.interpolateURI({ paths: [this.logPath], params: { id: id } });
    return url;
  }

}
