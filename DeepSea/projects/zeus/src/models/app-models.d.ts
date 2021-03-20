export interface Entity {
  id: string | number;
  name: string | number;
  description?: string;
  updatedDate?: Date;
  createdData?: Date;
}

export interface ErrorMessageLog {
  message: string;
  errorType: ErrorMessageLog;
}
