import { renderPreviewHTML } from '@arcgis/core/symbols/support/symbolUtils';
import { useEffect, useRef } from 'react';

type LegendSwatchProps = {
  symbol: __esri.Symbol | null;
};

export default function LegendSwatch({ symbol }: LegendSwatchProps) {
  const symbolRef = useRef<HTMLDivElement>(null);
  const symbolHasBeenRendered = useRef(false);

  useEffect(() => {
    if (symbolRef.current && !symbolHasBeenRendered.current && symbol) {
      renderPreviewHTML(symbol, {
        node: symbolRef.current,
        size: {
          height: 6,
          width: 30,
        },
      });
      symbolHasBeenRendered.current = true;
    }
  }, [symbol]);

  return <div ref={symbolRef}></div>;
}
