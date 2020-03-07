import * as Sentry from '@sentry/browser';

export function init() {
  Sentry.init({
    dsn: 'https://a72506963e424ada9f9445f561a9f47e@sentry.io/3927429',
  });
}

export function log(error) {
  Sentry.captureException(error);
}

export default { init, log };
