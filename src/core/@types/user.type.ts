export namespace UserData {
  export interface Me {
    id: string;
    name: string;
    email: string;
    role: string;
    status?: number;
    avatar?: string;
    dateAt?: timestamps;
  }
  export interface timestamps {
    createdAt: Date;
    updatedAt: Date;
  }

  export interface FormPayload {
    name: string;
    password: string;
    email: string;
    role?: string;
  }

}
