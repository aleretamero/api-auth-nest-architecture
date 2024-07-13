import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { CreatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/update-personal-data.dto';
import { PersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/personal-data.dto';
import { I18nService } from '@/infra/i18n/i18n.service';

@Injectable()
export class PersonalDataService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly i18nService: I18nService,
  ) {}

  async create(
    userId: string,
    createPersonalDatumDto: CreatePersonalDataDto,
  ): Promise<PersonalDataDto> {
    const userAlreadyHasPersonalData =
      await this.typeormService.personalData.existsBy({
        userId,
      });

    if (userAlreadyHasPersonalData) {
      throw new BadRequestException(
        this.i18nService.t('user.personal_data.already_exists'),
      );
    }

    const personalData = this.typeormService.personalData.create({
      userId,
      firstName: createPersonalDatumDto.firstName,
      lastName: createPersonalDatumDto.lastName,
      dateOfBirth: createPersonalDatumDto.dateOfBirth,
    });

    await this.typeormService.personalData.save(personalData);

    return new PersonalDataDto(personalData);
  }

  async findAll(): Promise<PersonalDataDto[]> {
    const personalDatas = await this.typeormService.personalData.find();

    return personalDatas.map(
      (personalData) => new PersonalDataDto(personalData),
    );
  }

  async findOne(id: string): Promise<PersonalDataDto> {
    const personalData = await this.typeormService.personalData.findOne({
      where: { id },
    });

    if (!personalData) {
      throw new NotFoundException(
        this.i18nService.t('user.personal_data.not_found'),
      );
    }

    return new PersonalDataDto(personalData);
  }

  async update(
    userId: string,
    updatePersonalDataDto: UpdatePersonalDataDto,
  ): Promise<PersonalDataDto> {
    const personalData = await this.typeormService.personalData.findOne({
      where: { userId },
    });

    if (!personalData) {
      throw new NotFoundException(
        this.i18nService.t('user.personal_data.not_found'),
      );
    }

    const updatedPersonalDatum = this.typeormService.personalData.merge(
      personalData,
      updatePersonalDataDto,
    );

    await this.typeormService.personalData.save(updatedPersonalDatum);

    return new PersonalDataDto(personalData);
  }

  async remove(userId: string): Promise<void> {
    const personalData = await this.typeormService.personalData.findOne({
      where: { userId },
    });

    if (!personalData) {
      throw new NotFoundException(
        this.i18nService.t('user.personal_data.not_found'),
      );
    }

    await this.typeormService.personalData.remove(personalData);
  }
}
