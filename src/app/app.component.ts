import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Loading } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoading$: Observable<boolean> | undefined;

  constructor(private loadingService: Loading) {
    this.loadingService.close();
  }

  ngOnInit(): void {
    this.isLoading$ = this.loadingService.isLoading$;
  }
}
