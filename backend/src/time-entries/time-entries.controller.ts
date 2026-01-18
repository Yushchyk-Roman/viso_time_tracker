import { Controller, Get, Post, Body } from '@nestjs/common';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';

@Controller('time-entries')
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Post()
  create(@Body() createTimeEntryDto: CreateTimeEntryDto) {
    return this.timeEntriesService.create(createTimeEntryDto);
  }

  @Get()
  findAll() {
    return this.timeEntriesService.findAll();
  }
}