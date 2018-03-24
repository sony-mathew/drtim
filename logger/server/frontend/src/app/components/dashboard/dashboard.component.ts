import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  logs: any [] = [];
  pageNumber: number = 1;

  constructor(private loggerService: LoggerService) { }

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loggerService.paginate(this.pageNumber).subscribe((logs: any[]) => {
      this.logs = logs;
    });
  }

}
