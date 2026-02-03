import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a Schedule B code for display and FileMaker.
 * 10-digit codes are formatted as XXXX.XX.XXXX (e.g., 6309.00.0000).
 * Non-10-digit codes (section/chapter headings) are returned as-is.
 */
export function formatScheduleBCode(code: string | undefined): string {
  if (!code || typeof code !== 'string') return code ?? '';
  const digitsOnly = code.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return `${digitsOnly.slice(0, 4)}.${digitsOnly.slice(4, 6)}.${digitsOnly.slice(6, 10)}`;
  }
  return code;
}

/**
 * Normalizes capitalization of text to title case while preserving important patterns.
 * Handles roman numerals, common words, and maintains proper sentence structure.
 */
function normalizeCapitalization(text: string): string {
  if (!text || text.trim().length === 0) {
    return text;
  }

  // Common words that should be lowercase unless they're the first word or after punctuation
  const lowercaseWords = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into',
    'nor', 'of', 'on', 'or', 'the', 'to', 'with', 'not', 'elsewhere', 'specified',
    'included', 'other', 'than', 'but', 'not', 'nor'
  ]);

  // Roman numerals that should stay uppercase
  const romanNumerals = new Set(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']);

  // Split text into words, preserving spaces
  // Use a regex that captures word boundaries and punctuation
  const tokens = text.split(/(\s+|[-.,:;!?]+)/);
  const normalizedTokens: string[] = [];
  let shouldCapitalize = true; // Capitalize first word and words after punctuation

  for (const token of tokens) {
    // Preserve whitespace and punctuation as-is
    if (/^\s+$/.test(token) || /^[-.,:;!?]+$/.test(token)) {
      normalizedTokens.push(token);
      // After colon or semicolon, capitalize next word
      if (token.includes(':') || token.includes(';')) {
        shouldCapitalize = true;
      }
      continue;
    }

    // Skip empty tokens
    if (token.length === 0) {
      continue;
    }

    // Process word tokens
    const upperToken = token.toUpperCase();
    
    // Preserve roman numerals
    if (romanNumerals.has(upperToken)) {
      normalizedTokens.push(upperToken);
      shouldCapitalize = false;
      continue;
    }

    // Check if it's a lowercase word that should stay lowercase
    const lowerToken = token.toLowerCase();
    if (!shouldCapitalize && lowercaseWords.has(lowerToken)) {
      normalizedTokens.push(lowerToken);
      continue;
    }

    // Convert to title case: first letter uppercase, rest lowercase
    const normalized = token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    normalizedTokens.push(normalized);
    shouldCapitalize = false;
  }

  return normalizedTokens.join('');
}

/**
 * Combines nested Schedule B descriptions into a single full description.
 * Removes leading hyphens and spaces, normalizes capitalization, and intelligently combines parent and child descriptions.
 * 
 * @param parentDescriptions - Array of parent descriptions (from root to immediate parent)
 * @param currentDescription - The current node's description
 * @returns Combined description string with normalized capitalization
 */
export function combineNestedDescriptions(
  parentDescriptions: string[],
  currentDescription: string
): string {
  // Filter out empty descriptions
  const allDescriptions = [...parentDescriptions, currentDescription].filter(
    (desc) => desc && desc.trim().length > 0
  );

  if (allDescriptions.length === 0) {
    return '';
  }

  // Clean each description by removing leading hyphens and spaces
  const cleanedDescriptions = allDescriptions.map((desc) => {
    // Remove leading hyphens, spaces, and colons
    return desc.replace(/^[\s\-:]+/, '').trim();
  });

  // Filter out any empty strings after cleaning
  const validDescriptions = cleanedDescriptions.filter(
    (desc) => desc.length > 0
  );

  if (validDescriptions.length === 0) {
    return '';
  }

  // Combine descriptions with spaces
  const combined = validDescriptions.join(' ');

  // Normalize capitalization
  return normalizeCapitalization(combined);
}
