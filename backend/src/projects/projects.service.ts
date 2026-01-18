import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from '../prisma.service';
@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        color: createProjectDto.color || 'blue',
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
