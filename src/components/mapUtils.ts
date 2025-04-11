import Graphic from '@arcgis/core/Graphic';

export async function getCoarseLocation() {
  return new Promise<{ x: number; y: number } | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ x: position.coords.longitude, y: position.coords.latitude });
      },
      (error) => {
        console.error('Error getting location:', error);
        resolve(null);
      },
      {
        timeout: 250,
        maximumAge: 1000 * 60 * 10, // 10 minutes
      },
    );
  });
}

export function getFeedbackGraphic(center: number[]) {
  return new Graphic({
    attributes: {},
    geometry: {
      type: 'point',
      x: center[0],
      y: center[1],
      spatialReference: {
        wkid: 3857,
      },
    },
    symbol: {
      type: 'simple-marker',
      color: [255, 0, 0, 0.5],
      size: '20px',
      outline: {
        color: [255, 0, 0],
        width: 2,
      },
    },
  });
}

export const PADDING = 320;
export const INITIAL_MAP_ZOOM = 13;
