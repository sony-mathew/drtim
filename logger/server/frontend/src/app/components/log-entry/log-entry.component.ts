import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../../services';

@Component({
  selector: 'app-log-entry',
  templateUrl: './log-entry.component.html',
  styleUrls: ['./log-entry.component.scss']
})
export class LogEntryComponent implements OnInit {

  log: any = null;
  sub: any;
  id: string;

  panelOpenState: boolean = false;

  constructor(
    private loggerService: LoggerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['log_id']) {
        this.id = params['log_id'];
        this.loadLog();
      }
    });
  }

  loadLog() {
    this.loggerService.show(this.id).subscribe((log: any) => {
      this.log = log;
    });
  }

}
