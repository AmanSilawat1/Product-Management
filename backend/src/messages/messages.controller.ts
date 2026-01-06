import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
    @Get()
    listMessages() {
        return 'This action returns all messages';
    }

    @Post()
    createMessage(@Body() body: any) {
        console.log(body)
        return 'This action adds a new message';
    }

    @Get('/:id')
    getMessage(@Param('id') id: string) {
        console.log(id)
        return 'This action returns a #id message';
    }
}
