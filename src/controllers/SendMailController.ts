import SendMail from '@models/SendMail';
import { Response } from 'express';
import { Mail, Middleware } from 'src/core/@types';

class SendMailController {
  public async sendMail(request: Middleware.RequestWithUser, response: Response) {
    const resUser = request.loggedUser;
    const payload = request.body.sendMail;

    const sent: Mail.SentPayload[] = [];

    try {
      if (!payload) {
        return response.status(400).json({ message: 'Required field', error: ['sendMail'] });
      }

      const isValide = payload.every((send: Mail.FormPayload) => (send.name && send.email && send.subject && send.context));

      if (!isValide) {
        return response.status(400).json({ message: 'Required field', error: ['name', 'email', 'subject', 'context'] });
      }

      await Promise.all(
        payload.map(async (item: Mail.FormPayload) => {
          const data = await SendMail.create({
            name: item.name,
            email: item.email,
            priority: item.priority,
            status: item.status,
            subject: item.subject,
            context: item.context,
            dueDate: item.dueDate,
            owner: resUser,
          });

          sent.push({
            id: data.id,
            name: data.name,
            email: data.email,
            priority: data.priority,
            status: data.status,
            subject: data.subject,
            context: data.context,
            dueDate: data.dueDate,
            createdAt: data.createdAt,
            owner: data.owner,
          });
        }),
      );

      return response.status(200).json(sent);
    } catch (err) {
      return response.status(400).json({ message: 'Error creating new flow mail, try again', error: err });
    }
  }
}

export default new SendMailController();
