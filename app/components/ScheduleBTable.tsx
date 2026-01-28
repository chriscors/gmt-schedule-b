'use client'

import React, { useState } from 'react';
import type { ScheduleBItem, ScheduleBResponse, SelectedCode } from '../types/census';
import { ChevronRight, Loader2, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { fmFetch } from '@proofkit/webviewer';

interface TreeNodeProps {
  node: ScheduleBItem;
  onSelect: (code: SelectedCode) => void;
  level?: number;
}

// Check if we're running in a FileMaker WebViewer context
const isFileMakerWebViewer = () => {
  return typeof window !== 'undefined' && 
         typeof (window as any).FileMaker !== 'undefined' && 
         typeof (window as any).FileMaker.PerformScript === 'function';
};

// Check if a node has any leaf descendants (10-digit codes)
const hasLeafDescendants = (node: ScheduleBItem): boolean => {
  // If this node is a leaf node, return true
  if (node.code && node.code.length === 10) {
    return true;
  }
  
  // If this node has children, check if any descendant is a leaf
  if (node.items && node.items.length > 0) {
    return node.items.some(child => hasLeafDescendants(child));
  }
  
  return false;
};

function TreeNode({ node, onSelect, level = 0 }: TreeNodeProps) {
  // Expand by default if this node has leaf descendants (nodes with Select buttons)
  const [isExpanded, setIsExpanded] = useState(() => {
    const hasChildren = node.items && node.items.length > 0;
    const isLeafNode = node.code && node.code.length === 10;
    // Expand if it has children and those children (or descendants) include leaf nodes
    return hasChildren && !isLeafNode && hasLeafDescendants(node);
  });
  const [fmLoading, setFmLoading] = useState(false);

  const hasChildren = node.items && node.items.length > 0;
  const isLeafNode = node.code && node.code.length === 10; // 10-digit codes are selectable

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSelect = async () => {
    if (!isLeafNode || !node.code) return;
    
    const selectedCode: SelectedCode = {
      code: node.code,
      description: node.desc || node.name || '',
      uom: node.uom,
    };

    // Call the onSelect callback
    if (onSelect) {
      onSelect(selectedCode);
    }

    // If running in FileMaker WebViewer, also call the FileMaker script
    if (isFileMakerWebViewer()) {
      setFmLoading(true);
      try {
        await fmFetch('Handle Schedule B Callback', {
          scheduleBNumber: selectedCode.code,
          description: selectedCode.description,
        });
      } catch (error) {
        console.error('Error calling FileMaker script:', error);
        // You might want to show a toast notification here
      } finally {
        setFmLoading(false);
      }
    }
  };

  return (
    <div className="border-b border-border last:border-b-0">
      <div
        className={cn(
          "flex items-center py-3 px-4 transition-colors",
          "hover:bg-accent/50",
          hasChildren && "cursor-pointer"
        )}
        style={{ paddingLeft: `${level * 24 + 16}px` }}
      >
        {/* Expand/Collapse Icon */}
        <div className="w-8 flex-shrink-0">
          {hasChildren && (
            <button
              onClick={handleToggle}
              className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded p-1 transition-colors"
            >
              <ChevronRight
                className={cn(
                  "w-4 h-4 transform transition-transform duration-200",
                  isExpanded && "rotate-90"
                )}
              />
            </button>
          )}
        </div>

        {/* Code */}
        <div className="w-36 flex-shrink-0 font-mono text-sm font-semibold text-foreground">
          {node.code || '—'}
        </div>

        {/* Description */}
        <div className="flex-1 text-sm text-foreground px-4">
          {node.desc || node.name || '—'}
        </div>

        {/* UOM */}
        <div className="w-28 flex-shrink-0 text-sm text-muted-foreground text-center">
          {node.uom || '—'}
        </div>

        {/* Select Button */}
        <div className="w-28 flex-shrink-0 text-right">
          {isLeafNode && (
            <button
              onClick={handleSelect}
              disabled={fmLoading}
              className={cn(
                "px-4 py-1.5",
                "bg-primary text-primary-foreground text-xs font-semibold rounded-lg",
                "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "transition-all duration-200",
                "shadow-sm hover:shadow-md",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center gap-1.5 mx-auto"
              )}
            >
              {fmLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Select</span>
              )}
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
      <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">Loading Schedule B codes...</p>
      </div>
    );
  }

  if (!scheduleData) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="px-6 py-4 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Schedule B Classification Results
          </h3>
        </div>
      </div>

      {/* Table Header */}
      <div className="flex items-center py-3 px-4 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <div className="w-8 flex-shrink-0"></div>
        <div className="w-36 flex-shrink-0">Code</div>
        <div className="flex-1 px-4">Description</div>
        <div className="w-28 flex-shrink-0 text-center">UOM</div>
        <div className="w-28 flex-shrink-0 text-right">Action</div>
      </div>

      {/* Tree View */}
      <div className="max-h-[600px] overflow-y-auto">
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
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No Schedule B codes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
