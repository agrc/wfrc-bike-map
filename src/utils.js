/*
  Calcite breakpoints:
  Small (s), 476px
  Medium (m), 768px
  Large (l), 1152px
  Extra larger (xl), 1440px

  ref: https://github.com/Esri/calcite-design-system/issues/6670
*/

const BREAKPOINTS = {
  s: '476px',
  m: '768px',
  l: '1152px',
  xl: '1440px',
};

export function mediaMinWidth(breakpoint, onChange) {
  if (!BREAKPOINTS[breakpoint]) {
    throw new Error(`Invalid breakpoint: ${breakpoint}`);
  }

  return mediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]})`, onChange);
}

export function mediaMaxWidth(breakpoint, onChange) {
  if (!BREAKPOINTS[breakpoint]) {
    throw new Error(`Invalid breakpoint: ${breakpoint}`);
  }

  return mediaQuery(`(max-width: ${BREAKPOINTS[breakpoint]})`, onChange);
}

export function mediaQuery(queryString, onChange) {
  const queryResult = matchMedia(queryString);
  if (queryResult.matches) {
    onChange(queryResult);
  }

  queryResult.addEventListener('change', onChange);

  return queryResult;
}
