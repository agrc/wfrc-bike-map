export default {
  WEB_MAP_ID: '6ad72cac07b6464f9542e7daaa884b44',
  FILTER_HEADINGS: {
    routeTypes: 'Route Types',
    trafficStress: 'Traffic Stress',
  },
  ROUTE_TYPES: {
    pavedPath: {
      label: 'Paved Path',
      value: 'Paved Path',
    },
    protectedBikeLane: {
      label: 'Protected Bike Lane',
      value: 'Protected Bike Lane',
    },
    bikeLane: {
      label: 'Bike Lane',
      value: 'Bike Lane',
    },
    markedRoute: {
      label: 'Marked Route',
      value: 'Marked Route',
    },
    unmarkedRoute: {
      label: 'Unmarked Route',
      value: 'Unmarked Route',
    },
  },
  TRAFFIC_STRESS: {
    mostComfortable: {
      label: 'Most Comfortable',
      value: 'Most Comfortable',
    },
    comfortable: {
      label: 'Comfortable',
      value: 'Comfortable',
    },
    lessComfortable: {
      label: 'Less Comfortable',
      value: 'Less Comfortable',
    },
    higherTraffic: {
      label: 'Higher Traffic',
      value: 'Higher Traffic',
    },
    trafficLights: {
      label: 'Traffic Lights',
      value: 'Traffic Lights',
    },
  },
  /*
    Tailwind breakpoints:
    sm   |  @media (min-width: 640px)
    md   |  @media (min-width: 768px)
    lg   |  @media (min-width: 1024px)
    xl   |  @media (min-width: 1280px)
    2xl  |  @media (min-width: 1536px)

    ref: https://tailwindcss.com/docs/responsive-design
  */
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
};
