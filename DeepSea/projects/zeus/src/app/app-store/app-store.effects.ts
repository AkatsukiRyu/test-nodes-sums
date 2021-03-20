import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ZeusAppActionNames } from '../../constants/app-constant';

@Injectable()
export class AppEffects {
  public constructor(
    private actions$: Actions,
    private httpClient: HttpClient
  ) {}

  // [TODO]: change any to the specific model that's return from API
  public getUserInfo$ = createEffect(
    (): Observable<any> => {
      return this.actions$.pipe(
        ofType(ZeusAppActionNames.Zeus_Get_User_Info),
        switchMap((response) => {
          // handle call API here => temp is return;
          return response;
        })
      );
    }
  );
}
