import {
  Controller,
  Get,
  Param,
  Request,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { ListResponseDto } from '../share/dto/list-response.dto';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../share/enum/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { LogService } from 'src/log/log.service';
import { LogCreateDto } from 'src/log/dto/log-create.dto';
import { PayloadUserDto } from 'src/auth/dto/payload-user.dto';
import { LogEvent } from 'src/log/log.entity';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly logService: LogService,
  ) {}

  @Roles(RoleEnum.ROOT)
  @Get()
  async findAll(
    @Request() req,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<ListResponseDto> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = await this.companyService.findAll(page, limit, search);
      logCreateDto.EventMessage = 'Get Roles';
      logCreateDto.EventMessage = payloadUserDto.companyid;
      await this.logService.create(logCreateDto, payloadUserDto);
      return response;
    } catch (Error) {
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }

  @Roles(RoleEnum.ROOT)
  @Get(':companyId')
  async findOne(
    @Request() req,
    @Param('companyId') companyId: string,
  ): Promise<Company> {
    const payloadUserDto: PayloadUserDto = req.user;
    const logCreateDto: LogCreateDto = new LogCreateDto();
    try {
      const response = this.companyService.findOne(companyId);
      logCreateDto.EventMessage = 'FindOne Company';
      logCreateDto.EventMethod = LogEvent.Read;
      logCreateDto.EventMessage = payloadUserDto.companyid;
      await this.logService.create(logCreateDto, payloadUserDto);
      return response;
    } catch (Error) {
      logCreateDto.ErrorMessage = Error;
      logCreateDto.EventMethod = LogEvent.Error;
      await this.logService.create(logCreateDto, payloadUserDto);
    }
  }
}
