export interface RowData {
  [key: string]: string;
}

export interface VectorizedRow {
  [key: string]: string | number[];
  vectorized: number[];
}
