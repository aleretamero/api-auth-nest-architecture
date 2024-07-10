import { PartialType } from '@nestjs/swagger';
import { CreatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/create-personal-data.dto';

export class UpdatePersonalDataDto extends PartialType(CreatePersonalDataDto) {}
