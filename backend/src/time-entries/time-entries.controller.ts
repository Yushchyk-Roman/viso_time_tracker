import { Controller, Get, Post, Body, Delete, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

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

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.timeEntriesService.remove(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateTimeEntryDto) {
    return this.timeEntriesService.update(id, updateDto);
  }
}