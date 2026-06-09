import axios, { AxiosProgressEvent, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Store } from 'vuex';
import { IResponse, IRootState } from '~/domain/models';
import { uploadDownloadFile } from '~/helpers';

function createInterceptors(store: Store<IRootState>) {
  axios.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        config.headers['X-Honeypot'] = 'App';
        if (/upload/.test(config.url)) {
          config.headers['Content-Type'] = 'multipart/form-data';
          config.maxBodyLength = Infinity;
          config.maxContentLength = Infinity;
          config.onUploadProgress = ({ loaded, total }: AxiosProgressEvent) => {
            uploadDownloadFile(loaded, total);
          };
        } else {
          config.headers['Content-Type'] = 'application/json';
        }
        config.headers.Authorization = store.getters.getToken;
        await checkAuth(config);
        const session = store.getters.getSession;
        if (session) {
          config.headers.SSID = session;
        }
        config.url = $ENDPOINT + config.url;
        return config;
      } catch (e) {
        throw new Error(e);
      }
    },
    error => {
      /* eslint-disable no-console */
      console.error(error.request);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    response => response,
    error => {
      throw new Error(error.response?.data?.message || error.message);
    }
  );
}

class Http {
  public async get<TResponse>(url: string): Promise<IResponse<TResponse>> {
    const resp: AxiosResponse<IResponse<TResponse>> = await axios.get(url);
    if (resp.status === 204) {
      return Promise.resolve(void 0);
    }
    if (!resp || !resp.data || resp instanceof Error) {
      return Promise.reject(resp);
    }
    return resp.data;
  }

  public async post<TPayload, TResponse>(url: string, data: TPayload): Promise<IResponse<TResponse>> {
    let resp: AxiosResponse<IResponse<TResponse>>;
    try {
      resp = await axios.post(url, data);
      return resp.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async put<TPayload, TResponse>(url: string, data: TPayload): Promise<IResponse<TResponse>> {
    let resp: AxiosResponse<IResponse<TResponse>>;
    try {
      resp = await axios.put(url, data);
      return resp.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async delete(url: string): Promise<IResponse<string>> {
    let resp: AxiosResponse<IResponse<string>>;
    try {
      resp = await axios.delete(url);
      return resp.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

function checkAuth(config: AxiosRequestConfig): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (/signup|auth|verify|resend|reset/.test(config.url)) {
      return resolve(true);
    }
    if (config.headers.Authorization?.length > 0) {
      return resolve(true);
    }
    return reject(new Error('Forbidden'));
  });
}

export { createInterceptors };

const $http = new Http();
export default $http;
