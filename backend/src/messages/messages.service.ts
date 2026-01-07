import { MessagesRepository } from './messages.repository';

export class MessagesService {
    messagesRepo: MessagesRepository;

    constructor() {
        this.messagesRepo = new MessagesRepository();
    }

    findOne(id: string) {
        return this.messagesRepo.findOne(id);
    }

    findAll() {
        return this.messagesRepo.findAll();
    }

    createMessage(content: string) {
        return this.messagesRepo.createMessage(content);
    }
}