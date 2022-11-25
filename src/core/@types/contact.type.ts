export namespace ContactData {
  export interface ContactPayload {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: boolean;
    owner: any;
    createdAt: Date;
  }
  export interface FormPayload {
    name: string;
    email: string;
    phone?: string;
    status?: boolean;
  }

}
