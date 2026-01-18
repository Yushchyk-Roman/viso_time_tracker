import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TimeEntriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTimeEntryDto) {
    const date = new Date(dto.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const existingEntries = await this.prisma.timeEntry.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const totalHours = existingEntries.reduce((sum, entry) => sum + entry.hours, 0);

    if (totalHours + dto.hours > 24) {
      throw new BadRequestException(
        `Не можна записати більше 24 годин на день. Вже записано: ${totalHours} год.`,
      );
    }

    return this.prisma.timeEntry.create({
      data: {
        date: startOfDay,
        projectName: dto.projectName,
        hours: dto.hours,
        description: dto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.timeEntry.findMany({
      orderBy: {
        date: 'desc',
      },
    });
  }
}