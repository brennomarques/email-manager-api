import Contact from '@models/Contact';
import { Request, Response } from 'express';
import { ContactData, EMPTY_OBJECT, Middleware } from 'src/core/@types';

class ContactController {
  public async index(request: Request, response: Response) {
    const filter = {};

    try {
      if (request.query.filter) {
        const query = request.query.filter as [];

        query.forEach((item: any) => {
          if (item.field === 'name') {
            filter[request.query.filter[1].field] = { $regex: `.*${request.query.filter[1].value}.*`, $options: 'i' };
          }
          filter[request.query.filter[0].field] = request.query.filter[0].value;
        });
      }

      const contacts = await Contact.find(filter).populate({ path: 'owner', select: ['email', 'name'] });

      return response.status(200).json(contacts);
    } catch (err) {
      return response.status(400).send({ message: 'Error list contact', error: err });
    }
  }

  public async show(request: Request, response: Response) {
    const idContact = request.params.id;

    try {
      const contactExists = await Contact.findById(idContact).populate({ path: 'owner', select: ['email', 'name'] });

      if (!contactExists) {
        return response.status(404).json({ message: 'Contact already exists' });
      }

      return response.status(200).json(contactExists);
    } catch (err) {
      return response.status(400).send({ message: 'Error show contact', error: err });
    }
  }

  public async store(request: Middleware.RequestWithUser, response: Response) {
    const resUser = request.loggedUser;
    const payload: ContactData.Payload = request.body;

    try {
      if (!(payload.name && payload.email)) {
        return response.status(400).json({ message: 'Required field', error: ['name', 'email'] });
      }

      const contactExists = await Contact.findOne({ email: payload.email });

      if (contactExists) {
        return response.status(400).json({ message: 'Constact already exists' });
      }

      const contact = await Contact.create({
        name: payload.name, email: payload.email, phone: payload.phone, status: payload.status, owner: resUser,
      });

      const collection: ContactData.Contact = {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        status: contact.status,
        owner: contact.owner,
        createdAt: contact.createdAt,
      };

      return response.status(201).json(collection);
    } catch (err) {
      return response.status(400).json({ message: 'Error creating new contact, try again', error: err });
    }
  }

  public async update(request: Middleware.RequestWithUser, response: Response) {
    const idContact = request.params.id;
    const payload: ContactData.Update = request.body;

    try {
      if (Object.values(payload).length === EMPTY_OBJECT.EMPTY) {
        return response.status(400).json({ message: 'Required field', error: ['name', 'phone', 'status'] });
      }

      const contactExists = await Contact.findById(idContact);

      if (!contactExists) {
        return response.status(404).json({ message: 'Contact already exists' });
      }

      const update = await Contact.findByIdAndUpdate(
        idContact,
        { name: payload.name, phone: payload.phone, status: payload.status },
        { new: true },
      );

      return response.status(200).json(update);
    } catch (err) {
      return response.status(400).send({ message: 'Error updating contact', error: err });
    }
  }

  public async destroy(request: Request, response: Response) {
    const idContact = request.params.id;

    try {
      const contactExists = await Contact.findById(idContact);

      if (!contactExists) {
        return response.status(404).json({ message: 'Contact already exists' });
      }

      const removed = await Contact.findByIdAndDelete(contactExists.id);

      return response.status(200).json({ removed });
    } catch (err) {
      return response.status(400).send({ message: 'Error delete contact', error: err });
    }
  }
}

export default new ContactController();
