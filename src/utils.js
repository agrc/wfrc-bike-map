export function mediaQuery(query, onChange) {
  const mediaQuery = matchMedia(query);
  if (mediaQuery.matches) {
    onChange(mediaQuery);
  }

  mediaQuery.addEventListener('change', onChange);

  return mediaQuery;
}
