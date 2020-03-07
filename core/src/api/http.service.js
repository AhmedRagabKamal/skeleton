import axios from 'axios';
import axiosCancel from 'axios-cancel';
import ErrorModel from '../errors/ErrorModel';
import { log } from '../errors/log.service';

export const httpService = axios.create({
  baseURL: '',
  timeout: 120000,
  cancelable: true,
});

axiosCancel(httpService);

let getRequestCounter = 0;
/**
 * Interceptor on every request, run the progress bar from project UI
 */

export function handleGetRequestLoading($progress) {
  httpService.interceptors.request.use(
    (config) => {
      getRequestCounter++;
      $progress();
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export function handleGetResponseLoading($progress) {
  httpService.interceptors.response.use(
    (response) => {
      getRequestCounter--;
      if (getRequestCounter <= 0) {
        $progress();
      }
      return response;
    },
    (error) => {
      getRequestCounter--;
      if (getRequestCounter <= 0) {
        $progress();
      }
      return Promise.reject(error);
    }
  );
}

/**
 * Interceptor on every response and map the error model
 */
httpService.interceptors.response.use(
  (response) => response,
  (err) => {
    if (axios.isCancel(err)) {
      err = {
        response: { status: 700, data: { message: 'Request Cancelled' } },
      };
    }
    const error = new ErrorModel(err);
    return Promise.reject(error);
  }
);

export function handleNotFoundError(handleError) {
  httpService.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.status === 404 && (error.handleNotFound || !error.stopErrorHandle)) {
        handleError(error);
      }
      return Promise.reject(error);
    }
  );
}

export function handleResponseError(handleError) {
  httpService.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        !error.stopErrorHandle &&
        error.status !== 404 &&
        error.status !== 700 &&
        (error.status !== 400 || (error.status === 400 && Object.keys(error.map || {}).length === 0))
      ) {
        log(error);
      }
      return Promise.reject(error);
    }
  );
}

export default httpService;
