export interface PoTableColumn {
  name: string;
  trackBy: string;
  sort?: 'ASC' | 'DESC';
  class?: string;
  isDate?: boolean;
  dateFormat?: string;
}

export interface PoGroupTableData {
  groupName: string;
  isGroup: boolean;
  textColor?: string;
  statusColor?: string;
  expandGroup?: boolean;
  collapse?: boolean;
  children: Array<any>;
}
