import React from 'react';
import type { Interaction } from '../types/census';
import { CheckCircle2 } from 'lucide-react';

interface KnownCharacteristicsProps {
  characteristics: Interaction[];
}

export function KnownCharacteristics({ characteristics }: KnownCharacteristicsProps) {
  if (!characteristics || characteristics.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary/5 rounded-xl p-5 sm:p-6 border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Classification Path
        </h4>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {characteristics.map((characteristic, index) => {
          // Extract the selected value from the characteristic
          const selectedValue = characteristic.values && characteristic.values[0]
            ? characteristic.values[0].second
            : characteristic.name;

          return (
            <div
              key={characteristic.id || index}
              className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-primary/30 shadow-sm text-sm"
            >
              <span className="text-muted-foreground font-medium">
                {characteristic.name}:
              </span>
              <span className="text-primary font-semibold">
                {selectedValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
