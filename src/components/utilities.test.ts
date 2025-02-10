import { describe, expect, it, vi } from 'vitest';
import { getWhereClause, setLayerViewFilter } from './utilities';

describe('getWhereClause', () => {
  it('should return correct where clause for selected classes', () => {
    const selectedClasses = [0, 1];
    const rendererClasses = [
      { values: [{ value: 'A' }, { value: 'B' }] },
      { values: [{ value: 'C' }] },
    ] as __esri.UniqueValueClass[];
    const fieldName = 'field';

    const result = getWhereClause(
      selectedClasses,
      rendererClasses,
      fieldName,
      true,
    );
    expect(result).toBe("field IN ('A','B','C')");
  });

  it('should return empty where clause if no selected classes', () => {
    const selectedClasses: number[] = [];
    const rendererClasses = [
      { values: [{ value: 'A' }, { value: 'B' }] },
      { values: [{ value: 'C' }] },
    ] as __esri.UniqueValueClass[];
    const fieldName = 'field';

    const result = getWhereClause(
      selectedClasses,
      rendererClasses,
      fieldName,
      true,
    );
    expect(result).toBe('field IN ()');
  });

  it('should handle numeric values correctly', () => {
    const selectedClasses = [0, 1];
    const rendererClasses = [
      { values: [{ value: 1 }, { value: 2 }] },
      { values: [{ value: 3 }] },
    ] as __esri.UniqueValueClass[];
    const fieldName = 'field';

    const result = getWhereClause(
      selectedClasses,
      rendererClasses,
      fieldName,
      false,
    );
    expect(result).toBe('field IN (1,2,3)');
  });
});

describe('setLayerViewFilter', () => {
  it('should set the correct filter on the layer view', async () => {
    const layer = { title: 'Test Layer' } as __esri.FeatureLayer;
    const mapView = {
      whenLayerView: () =>
        Promise.resolve({
          filter: null,
        }),
    } as unknown as __esri.MapView;
    const where = "field IN ('A', 'B')";

    const consoleLogSpy = vi.spyOn(console, 'log');
    await setLayerViewFilter(layer, mapView, where);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Test Layer: field IN ('A', 'B')",
    );
    consoleLogSpy.mockRestore();
  });

  it('should log an error if setting the filter fails', async () => {
    const layer = { title: 'Test Layer' } as __esri.FeatureLayer;
    const mapView = {
      whenLayerView: () => Promise.reject(new Error('Test Error')),
    } as unknown as __esri.MapView;

    const consoleErrorSpy = vi.spyOn(console, 'error');
    await setLayerViewFilter(layer, mapView, 'where clause');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error setting filter for layer Test Layer:',
      new Error('Test Error'),
    );
    consoleErrorSpy.mockRestore();
  });
});
