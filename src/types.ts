// src/types.ts
export interface Category {
    id: string;
    name: string;
    color: string;
  }
  
  export interface Task {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    categoryId: string;
  }
  
  export interface FilterState {
    category: {
      [key: string]: boolean;
    };
    duration: 'all' | '1week' | '2weeks' | '3weeks';
    search: string;
  }