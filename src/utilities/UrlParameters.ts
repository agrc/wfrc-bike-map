const LIST_SEPARATOR = '.';

type ParameterNames =
  | 'filterType'
  | 'otherLinks'
  | 'routeTypes'
  | 'trafficStress'
  | 'trafficSignals'
  | 'center'
  | 'zoom';
export function setUrlParameter(
  name: ParameterNames,
  value: string | boolean | number[] | number,
) {
  const url = new URL(window.location.href);
  if (Array.isArray(value)) {
    url.searchParams.set(name, value.join(LIST_SEPARATOR));
  } else {
    url.searchParams.set(name, value.toString());
  }

  window.history.replaceState({}, '', url.toString());
}

export function getUrlParameter(
  name: ParameterNames,
  type: 'string' | 'boolean' | 'number[]' | 'number',
  defaultValue?: string | boolean | number[] | number,
): string | boolean | number[] | number | null {
  const url = new URL(window.location.href);
  const value = url.searchParams.get(name);

  if (value === null && defaultValue !== undefined) {
    return defaultValue;
  }

  if (type === 'boolean') {
    return value === 'true';
  }

  if (type === 'number[]') {
    return value ? value.split(LIST_SEPARATOR).map(Number) : null;
  }

  if (type === 'number') {
    return value ? Number(value) : null;
  }

  return value;
}
