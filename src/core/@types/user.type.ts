export namespace UserData {

  export interface userJwt {
    id: string;
  }
  export interface UserPayload {
    id: string;
    name: string;
    email: string;
    status: number;
    role: string;
    createdAt: Date;
  }

  export interface FormPayload {
    name: string;
    password: string;
    email: string;
  }

}
