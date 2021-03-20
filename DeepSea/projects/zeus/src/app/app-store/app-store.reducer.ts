import { createReducer, on } from '@ngrx/store';
import { ErrorMessageLog } from '../../models/app-models';

import { AppUser } from '../../models/app-user.model';
import { ZeusAppActions } from './app-store.actions';

interface State {
  userInfo: AppUser;
  errorLog: ErrorMessageLog;
}

const initialState: State = {
  userInfo: null,
  errorLog: null,
};

export const appReducer = createReducer(
  initialState,
  on(ZeusAppActions.GetUserInfoFailed, (state, errorLog) => ({
    ...state,
    userInfo: null,
    errorLog: {
      ...errorLog,
    },
  })),
  on(ZeusAppActions.GetUserInfoSuccess, (state, userInformation) => ({
    ...state,
    userInfo: { ...userInformation },
    errorLog: null,
  }))
);
