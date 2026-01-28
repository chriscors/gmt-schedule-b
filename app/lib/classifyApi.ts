// API client for Census 3CE Classification API

import type { ClassifyResponse, ScheduleBResponse } from '../types/census';

// Use relative URLs - Next.js handles the base URL automatically
const CLASSIFY_ENDPOINT = '/api/classify';
const FIND_ENDPOINT = '/api/schedule-b';

// Default profile ID and configuration
const DEFAULT_PROFILE_ID = '57471f0c4ac2c9b910000000';
const DEFAULT_CONFIG = {
  username: 'NOT_SET',
  userData: 'NO_DATA_AVAIL',
  origin: 'US',
  destination: 'US',
  stopAtHS6: 'N',
};

/**
 * Start a new classification session
 * @param productDescription - The product description to classify
 * @param lang - Language code (default: 'en')
 * @returns Classification response
 */
export async function classifyStart(
  productDescription: string,
  lang: string = 'en'
): Promise<ClassifyResponse> {
  const payload = {
    state: 'start' as const,
    proddesc: productDescription,
    lang,
    schedule: 'import/export',
    profileId: DEFAULT_PROFILE_ID,
    ...DEFAULT_CONFIG,
  };

  const response = await fetch(CLASSIFY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Classification failed: ${response.statusText}`);
  }

  const data = await response.json();
  // The API wraps the response in a 'data' property
  return data.data || data;
}

/**
 * Continue an existing classification session with user answers
 * @param txId - Transaction ID from previous response
 * @param interactionId - Current question ID
 * @param values - Selected answers [{first: id, second: name}]
 * @param productDescription - Original product description
 * @returns Classification response
 */
export async function classifyContinue(
  txId: string,
  interactionId: string,
  values: Array<{ first: string; second: string }>,
  productDescription: string
): Promise<ClassifyResponse> {
  const payload = {
    state: 'continue' as const,
    interactionid: interactionId,
    txid: txId,
    values,
    proddesc: productDescription,
    profileId: DEFAULT_PROFILE_ID,
    ...DEFAULT_CONFIG,
  };

  const response = await fetch(CLASSIFY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Classification failed: ${response.statusText}`);
  }

  const data = await response.json();
  // The API wraps the response in a 'data' property
  return data.data || data;
}

/**
 * Find Schedule B codes for a given HS code
 * @param code - The HS code to find Schedule B codes for
 * @returns Schedule B hierarchy
 */
export async function findScheduleB(code: string): Promise<ScheduleBResponse> {
  const url = `${FIND_ENDPOINT}?code=${encodeURIComponent(code)}`;

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Find Schedule B failed: ${response.statusText}`);
  }

  const data = await response.json();
  // The API may wrap the response in a 'data' property
  return data.data || data;
}
