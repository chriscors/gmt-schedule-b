// Census API Type Definitions

export interface ClassifyStartRequest {
  state: 'start';
  proddesc: string;
  lang: string;
  schedule: string;
  profileId: string;
  username: string;
  userData: string;
  origin: string;
  destination: string;
  stopAtHS6: string;
}

export interface ClassifyContinueRequest {
  state: 'continue';
  interactionid: string;
  txid: string;
  values: Array<{ first: string; second: string }>;
  proddesc: string;
  profileId: string;
  username: string;
  userData: string;
  origin: string;
  destination: string;
  stopAtHS6: string;
}

export interface InteractionAttribute {
  id: string;
  name: string;
}

export interface Interaction {
  id: string;
  name: string;
  question?: string;
  attrs?: InteractionAttribute[];
  values?: Array<{ first: string; second: string }>;
}

export interface PotentialHeading {
  code: string;
  desc: string;
}

export interface ClassifyResponse {
  txId: string;
  hsCode?: string;
  currentItemInteraction?: Interaction;
  knownInteractions?: Interaction[];
  potentialHeadings?: PotentialHeading[];
}

export interface ScheduleBItem {
  code?: string;
  desc?: string;
  name?: string;
  uom?: string;
  items?: ScheduleBItem[];
}

export interface ScheduleBResponse {
  items: ScheduleBItem[];
}

export interface SelectedCode {
  code: string;
  description: string;
  uom?: string;
}
