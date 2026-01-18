import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TimeEntriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTimeEntryDto) {
    await this.validateHours(new Date(dto.date), dto.hours);
    return this.prisma.timeEntry.create({
      data: {
        date: new Date(dto.date),
        projectName: dto.projectName,
        hours: dto.hours,
        description: dto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.timeEntry.findMany({ orderBy: { date: 'desc' } });
  }

  async remove(id: number) {
    const entry = await this.prisma.timeEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Запис не знайдено');

    return this.prisma.timeEntry.delete({ where: { id } });
  }

  async update(id: number, dto: UpdateTimeEntryDto) {
    const oldEntry = await this.prisma.timeEntry.findUnique({ where: { id } });
    if (!oldEntry) throw new NotFoundException('Запис не знайдено');

    if (dto.date || dto.hours) {
      const targetDate = dto.date ? new Date(dto.date) : oldEntry.date;
      const targetHours = dto.hours !== undefined ? dto.hours : oldEntry.hours;

      await this.validateHours(targetDate, targetHours, id);
    }

    return this.prisma.timeEntry.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
  }

  private async validateHours(date: Date, newHours: number, excludeId?: number) {
    const startOfDay = new Date(date); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date); endOfDay.setHours(23, 59, 59, 999);

    const existingEntries = await this.prisma.timeEntry.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        id: excludeId ? { not: excludeId } : undefined,
      },
    });

    const totalHours = existingEntries.reduce((sum, entry) => sum + entry.hours, 0);

    if (totalHours + newHours > 24) {
      throw new BadRequestException(
        `Ліміт 24 години перевищено. Вже є: ${totalHours} год. + Ваші: ${newHours} год.`,
      );
    }
  }
}