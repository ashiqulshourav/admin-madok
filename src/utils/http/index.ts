import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CustomParamsSerializer
} from 'axios';
import {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from './types.d';
import { stringify } from 'qs';
import NProgress from '../progress';
import { TokenKey } from '@/utils/auth';
import { storageLocal, storageSession } from '@pureadmin/utils';
import { useUserStore } from '@/store/user';
import { addAcceptLanguageList } from './helper';
import { message } from '../message';

const defaultConfig: AxiosRequestConfig = {
  baseURL: '/match',
  timeout: 20000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    // 'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

window.axiosPromiseArr = [];
class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  private static initConfig: PureHttpRequestConfig = {};

  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        if (!config.noNprogress) NProgress.start();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === 'function') {
          config.beforeRequestCallback(config);
          return config;
        }

        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
        const whiteList = ['/refreshToken', '/login'];
        if (whiteList.some(_ => config!.url!.indexOf(_) < 0)) {

          const token: string = storageSession().getItem(TokenKey) ?? '';
          if (token) config!.headers!["Accesstoken"] = token;

          if (config?.url?.includes('/bet-center/cancel')) config.data = config.data.orderIds;

          if (addAcceptLanguageList.includes(config.url as string)) {
            const lan: { locale: string } = storageLocal().getItem('responsive-locale') ?? { locale: 'zh' }
            let lanStr = lan.locale === 'zh' ? 'CN' : 'EN'
            config!.headers!['accept-language'] = lanStr;
          }
        }
        config.cancelToken = new Axios.CancelToken(cancel => {
          window.axiosPromiseArr.push({ cancel })
        });
        return config;

      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** responseInterception */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        NProgress.done();
        if (typeof $config.beforeResponseCallback === 'function') {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        if (response.data.code === 10110) {
          return message(response.data.msg, {
            duration: 1000,
            type: 'error', onClose() {
              useUserStore().logOut();
            }
          })
        }
        return response.data;
      },
      (error: PureHttpError) => {
        switch (error!.response!.status) {
          case 403:
            useUserStore().logOut();
            break;
        }
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;
    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>('post', url, params, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>('get', url, params, config);
  }
}

export const http = new PureHttp();
