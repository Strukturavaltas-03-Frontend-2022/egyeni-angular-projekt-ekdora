import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { SpinnerComponent } from '../common/spinner/spinner.component';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private spinnerRef: OverlayRef = this.cdkSpinnerCreate();
  public loading = new BehaviorSubject<boolean>(false);

  constructor(private overlay: Overlay) {
    this.loading.pipe(
      tap((loading) => {
        loading
          ? this.showSpinner()
          : this.spinnerRef.hasAttached() ? this.stopSpinner() : null;
      })
    ).subscribe();
  }

  showSpinner() {
    this.spinnerRef.attach(new ComponentPortal(SpinnerComponent));
  }

  stopSpinner() {
    this.spinnerRef.detach();
  }

  private cdkSpinnerCreate() {
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    });
  }
}
