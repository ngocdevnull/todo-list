import { Injectable } from '@angular/core';
import { EVENT_BEFORE_UNLOAD, IS_PAGE_RELOAD } from '../../shared/constants/constant';

@Injectable({
  providedIn: 'root',
})
export class ReloadTrackingService {
  private isPageReloaded = false;

  constructor() {
    this.detectPageReload();
  }

  private detectPageReload() {
    window.addEventListener(EVENT_BEFORE_UNLOAD, () => {
      this.isPageReloaded = true;
      sessionStorage.setItem(IS_PAGE_RELOAD, 'true');
    });

    this.isPageReloaded = sessionStorage.getItem(IS_PAGE_RELOAD) === 'true';
  }

  public isReloaded(): boolean {
    return this.isPageReloaded;
  }

  public resetReloadStatus() {
    this.isPageReloaded = false;
    sessionStorage.removeItem(IS_PAGE_RELOAD);
  }
}
