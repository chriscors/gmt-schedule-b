import React, { useState } from 'react';
import type { ScheduleBItem, ScheduleBResponse, SelectedCode } from '../types/census';

interface TreeNodeProps {
  node: ScheduleBItem;
  onSelect: (code: SelectedCode) => void;
  level?: number;
}

function TreeNode({ node, onSelect, level = 0 }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels

  const hasChildren = node.items && node.items.length > 0;
  const isLeafNode = node.code && node.code.length === 10; // 10-digit codes are selectable
  const indent = level * 20;

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSelect = () => {
    if (isLeafNode && onSelect && node.code) {
      onSelect({
        code: node.code,
        description: node.desc || node.name || '',
        uom: node.uom,
      });
    }
  };

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div
        className={`flex items-center py-2 px-3 hover:bg-gray-50 ${
          hasChildren ? 'cursor-pointer' : ''
        }`}
        style={{ paddingLeft: `${indent + 12}px` }}
      >
        {/* Expand/Collapse Icon */}
        <div className="w-6 flex-shrink-0">
          {hasChildren && (
            <button
              onClick={handleToggle}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Code */}
        <div className="w-32 flex-shrink-0 font-mono text-sm text-gray-900">
          {node.code || '—'}
        </div>

        {/* Description */}
        <div className="flex-1 text-sm text-gray-700 px-2">
          {node.desc || node.name || '—'}
        </div>

        {/* UOM */}
        <div className="w-24 flex-shrink-0 text-sm text-gray-600 text-center">
          {node.uom || '—'}
        </div>

        {/* Select Button */}
        <div className="w-24 flex-shrink-0 text-right">
          {isLeafNode && (
            <button
              onClick={handleSelect}
              className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
            >
              Select
            </button>
          )}
        </div>
      </div>

      {/* Child Nodes */}
      {hasChildren && isExpanded && (
        <div>
          {node.items!.map((child, index) => (
            <TreeNode
              key={child.code || `${node.code}-${index}`}
              node={child}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ScheduleBTableProps {
  scheduleData: ScheduleBResponse | null;
  onSelect: (code: SelectedCode) => void;
  loading?: boolean;
}

export function ScheduleBTable({ scheduleData, onSelect, loading = false }: ScheduleBTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading Schedule B codes...</p>
      </div>
    );
  }

  if (!scheduleData) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Schedule B Classification Results
        </h3>
      </div>

      {/* Table Header */}
      <div className="flex items-center py-2 px-3 bg-gray-100 border-b border-gray-300 text-xs font-semibold text-gray-700 uppercase">
        <div className="w-6 flex-shrink-0"></div>
        <div className="w-32 flex-shrink-0">Code</div>
        <div className="flex-1 px-2">Description</div>
        <div className="w-24 flex-shrink-0 text-center">UOM</div>
        <div className="w-24 flex-shrink-0 text-right">Action</div>
      </div>

      {/* Tree View */}
      <div className="max-h-96 overflow-y-auto">
        {scheduleData.items && scheduleData.items.length > 0 ? (
          scheduleData.items.map((item, index) => (
            <TreeNode
              key={item.code || index}
              node={item}
              onSelect={onSelect}
              level={0}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No Schedule B codes found
          </div>
        )}
      </div>
    </div>
  );
}
