import { FsmStates } from '~/application/app';

export interface IEditor {
  container: {
    remove: () => void;
  };
  getValue: () => string;
  on: (event: string, callback: () => void) => void;
  setValue: (value: string) => void;
  destroy: () => void;
  setShowPrintMargin: (value: boolean) => void;
  setHighlightActiveLine: (value: boolean) => void;
  getSession: () => {
    selection: {
      clearSelection: () => void;
    };
  };
}

export interface IValidate {
  touched?: number;
  touch?: () => Promise<void>;
  valid?: () => boolean;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any;
}

export interface IMenu {
  name: string;
  nameAlt: string;
  fsmState: symbol;
  id: number;
}

type TResponseStatus = 'success' | 'error';

export interface IUser {
  id: string;
  login: string;
  email: string;
  displayName: string;
  waitingVerify?: boolean;
  yandexDiskAccessToken: string;
  yandexDiskRefreshToken: string;
}

export interface IResponse<TData> {
  status: TResponseStatus;
  data?: TData;
  message?: string;
  user?: IUser;
  token?: string;
}

export interface IRootState {
  endpoint: string;
  apiPath: string;
  loading: boolean;
  userDataPath: string;
  downloadsTargetPath: string;
  fsmState: symbol;
  isAuth: boolean;
  token: string;
  isDevelopment: boolean;
  timeout: NodeJS.Timeout | null;
  notification: boolean;
  error: boolean;
  component: string;
  section: Record<string, boolean>;
  history: Array<keyof typeof FsmStates>;
  yandexApiToken: string;
  currentUser: IUser;
  process: { name: string };
}
