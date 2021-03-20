import { createAction, props } from '@ngrx/store';
import { ZeusAppActionNames } from '../../constants/app-constant';
import { ErrorMessageLog } from '../../models/app-models';
import { AppUser } from '../../models/app-user.model';

const GetUserInfoData = createAction(ZeusAppActionNames.Zeus_Get_User_Info);

const GetUserInfoSuccess = createAction(
  ZeusAppActionNames.Zeus_Get_User_Success,
  props<AppUser>()
);

const GetUserInfoFailed = createAction(
  ZeusAppActionNames.Zeus_Get_User_Failed,
  props<ErrorMessageLog>()
);

export const ZeusAppActions = {
  GetUserInfoData,
  GetUserInfoSuccess,
  GetUserInfoFailed,
};
