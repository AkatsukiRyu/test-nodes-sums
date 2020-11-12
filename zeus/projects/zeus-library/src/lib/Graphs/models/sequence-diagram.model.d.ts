export interface SequenceBaseData {
  id: string | number;
  name: string;
  parent?: string | number;
  source?: string | number;
  target?: string | number;
}

export interface SequenceDiagramData {
  root: SequenceDataWrapper;
  generations: SequenceDataWrapper[];
  edges: SequenceBaseData[];
}

export interface SequenceDataWrapper {
  parent: SequenceBaseData;
  id?: string;
  operations: SequenceBaseData[];
}
