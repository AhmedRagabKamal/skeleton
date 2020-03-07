export function useAnalytics(...params) {
  if (window.ga) {
    // eslint-disable-next-line
    ga(...params);
  }
}

export default { useAnalytics };
