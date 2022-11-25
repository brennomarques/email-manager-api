export namespace ContactData {
  export interface Payload {
    name: string;
    email: string;
    phone?: string;
    status?: boolean;
  }
  export interface Update {
    name?: string;
    phone?: string;
    status?: boolean;
  }
  export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: boolean;
    owner: any;
    createdAt: Date;
  }

}
