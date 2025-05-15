import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getUrlParameter } from './UrlParameters';

describe('getUrlParameter', () => {
  let locationHref: string;

  // Save the original URL handling and set up mock
  beforeEach(() => {
    locationHref = 'https://example.com';

    // Mock window.location using vi.spyOn
    vi.spyOn(window, 'location', 'get').mockImplementation(
      () =>
        ({
          href: locationHref,
        }) as Location,
    );
  });

  afterEach(() => {
    // Restore all mocks
    vi.restoreAllMocks();
  });

  it('should return string parameter', () => {
    locationHref = 'https://example.com?filterType=route';
    const result = getUrlParameter('filterType', 'string');
    expect(result).toBe('route');
  });

  it('should return boolean parameter', () => {
    locationHref = 'https://example.com?trafficSignals=true';
    const result = getUrlParameter('trafficSignals', 'boolean');
    expect(result).toBe(true);
  });

  it('should return false for boolean parameter with value false', () => {
    locationHref = 'https://example.com?trafficSignals=false';
    const result = getUrlParameter('trafficSignals', 'boolean');
    expect(result).toBe(false);
  });

  it('should return number array parameter', () => {
    locationHref = 'https://example.com?trafficStress=1.2.3.4';
    const result = getUrlParameter('trafficStress', 'number[]');
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should return number parameter', () => {
    locationHref = 'https://example.com?zoom=12';
    const result = getUrlParameter('zoom', 'number');
    expect(result).toBe(12);
  });

  it('should return null for missing string parameter', () => {
    locationHref = 'https://example.com';
    const result = getUrlParameter('filterType', 'string');
    expect(result).toBeNull();
  });

  it('should return null for missing number array parameter', () => {
    locationHref = 'https://example.com';
    const result = getUrlParameter('trafficStress', 'number[]');
    expect(result).toBeNull();
  });

  it('should return null for missing number parameter', () => {
    locationHref = 'https://example.com';
    const result = getUrlParameter('zoom', 'number');
    expect(result).toBeNull();
  });

  // Tests for defaultValue parameter
  it('should return default string value when parameter is missing', () => {
    locationHref = 'https://example.com';
    const result = getUrlParameter('filterType', 'string', 'route');
    expect(result).toBe('route');
  });

  it('should return default boolean value when parameter is missing', () => {
    locationHref = 'https://example.com';
    const result = getUrlParameter('trafficSignals', 'boolean', true);
    expect(result).toBe(true);
  });

  it('should return default number array when parameter is missing', () => {
    locationHref = 'https://example.com';
    const result = getUrlParameter('trafficStress', 'number[]', [1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should return default number when parameter is missing', () => {
    locationHref = 'https://example.com';
    const result = getUrlParameter('zoom', 'number', 10);
    expect(result).toBe(10);
  });

  it('should ignore default value when parameter exists', () => {
    locationHref = 'https://example.com?zoom=12';
    const result = getUrlParameter('zoom', 'number', 10);
    expect(result).toBe(12);
  });
});
