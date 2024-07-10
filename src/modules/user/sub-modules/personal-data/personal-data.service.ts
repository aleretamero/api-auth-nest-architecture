import { Injectable } from '@nestjs/common';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { CreatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from '@/modules/user/sub-modules/personal-data/dto/update-personal-data.dto';
import { PersonalDataPresenter } from '@/modules/user/sub-modules/personal-data/presenters/personal-data.presenter';

@Injectable()
export class PersonalDataService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly presenter: PersonalDataPresenter,
  ) {}

  async create(
    userId: string,
    createPersonalDatumDto: CreatePersonalDataDto,
  ): Promise<PersonalDataPresenter> {
    const userAlreadyHasPersonalData =
      await this.typeormService.personalData.existsBy({
        userId,
      });

    if (userAlreadyHasPersonalData) {
      throw new Error('User already has personal data');
    }

    const personalData = this.typeormService.personalData.create({
      userId,
      firstName: createPersonalDatumDto.firstName,
      lastName: createPersonalDatumDto.lastName,
      dateOfBirth: createPersonalDatumDto.dateOfBirth,
    });

    await this.typeormService.personalData.save(personalData);

    return this.presenter.present(personalData);
  }

  async findAll(): Promise<PersonalDataPresenter[]> {
    return this.presenter.present(
      await this.typeormService.personalData.find(),
    );
  }

  async findOne(id: string): Promise<PersonalDataPresenter> {
    const personalData = await this.typeormService.personalData.findOne({
      where: { id },
    });

    if (!personalData) {
      throw new Error('Personal data not found');
    }

    return this.presenter.present(personalData);
  }

  async update(
    userId: string,
    updatePersonalDataDto: UpdatePersonalDataDto,
  ): Promise<PersonalDataPresenter> {
    const personalData = await this.typeormService.personalData.findOne({
      where: { userId },
    });

    if (!personalData) {
      throw new Error('Personal data not found');
    }

    const updatedPersonalDatum = this.typeormService.personalData.merge(
      personalData,
      updatePersonalDataDto,
    );

    await this.typeormService.personalData.save(updatedPersonalDatum);

    return this.presenter.present(updatedPersonalDatum);
  }

  async remove(userId: string): Promise<void> {
    const personalData = await this.typeormService.personalData.findOne({
      where: { userId },
    });

    if (!personalData) {
      throw new Error('Personal data not found');
    }

    await this.typeormService.personalData.remove(personalData);
  }
}
