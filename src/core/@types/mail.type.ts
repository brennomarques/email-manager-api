export namespace Mail {

  export interface FormPayload {
    name: string;
    email: string;
    priority?: number;
    status?: number;
    subject: string;
    context: string;
    dueDate?: Date;
  }

  export interface SentPayload {
    id: string;
    name: string;
    email: string;
    priority: number;
    status: number;
    subject: string;
    context: string;
    dueDate: Date;
    createdAt: Date;
    owner: any;
  }

}
