import React from 'react';
import type { Interaction } from '../types/census';

interface KnownCharacteristicsProps {
  characteristics: Interaction[];
}

export function KnownCharacteristics({ characteristics }: KnownCharacteristicsProps) {
  if (!characteristics || characteristics.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h4 className="text-sm font-semibold text-blue-900 mb-3">
        Classification Path
      </h4>
      <div className="flex flex-wrap gap-2">
        {characteristics.map((characteristic, index) => {
          // Extract the selected value from the characteristic
          const selectedValue = characteristic.values && characteristic.values[0]
            ? characteristic.values[0].second
            : characteristic.name;

          return (
            <div
              key={characteristic.id || index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-blue-300 text-sm"
            >
              <span className="text-gray-600 font-medium">
                {characteristic.name}:
              </span>
              <span className="text-blue-900 font-semibold">
                {selectedValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
