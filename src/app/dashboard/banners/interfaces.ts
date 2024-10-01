// interfaces.ts
export interface Category {
    _id?: string;
    name: string;
    description: string;
    image: string;
  }
  
  export interface NewCategory {
    name: string;
    description: string;
    image: string;
  }
  