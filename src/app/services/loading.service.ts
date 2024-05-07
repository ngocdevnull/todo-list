import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Loading {
  private readonly innerIsLoading$ = new ReplaySubject<boolean>(1);

  public isLoading$: Observable<boolean> = this.innerIsLoading$.asObservable();

  public open(): void {
    this.innerIsLoading$.next(true);
  }

  public close(): void {
    this.innerIsLoading$.next(false);
  }
}
