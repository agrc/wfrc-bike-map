import { Checkbox, Switch } from '@ugrc/utah-design-system';
import { useState } from 'react';
import config from '../config';

export default function Filter() {
  const [isRouteTypes, setIsRouteTypes] = useState<boolean>(true);

  return (
    <div className="p-4">
      <Switch
        className="mb-3"
        isSelected={isRouteTypes}
        onChange={setIsRouteTypes}
      >
        <h3>
          {isRouteTypes
            ? config.FILTER_HEADINGS.routeTypes
            : config.FILTER_HEADINGS.trafficStress}
        </h3>
      </Switch>
      <div className="space-y-1.5">
        {isRouteTypes
          ? Object.values(config.ROUTE_TYPES).map((routeType) => (
              <Checkbox value={routeType.value}>{routeType.label}</Checkbox>
            ))
          : Object.values(config.TRAFFIC_STRESS).map((trafficStress) => (
              <Checkbox value={trafficStress.value}>
                {trafficStress.label}
              </Checkbox>
            ))}
      </div>
    </div>
  );
}
