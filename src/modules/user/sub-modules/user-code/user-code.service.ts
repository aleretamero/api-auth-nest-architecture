import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { Injectable } from '@nestjs/common';
import { UserCodeStatus } from '@/modules/user/sub-modules/user-code/enums/user-code-status.enum';
import { UserCodeType } from '@/modules/user/sub-modules/user-code/enums/user-code-type.enum';
import { ClockUtil } from '@/common/helpers/clock-util';
import { Code } from '@/common/helpers/code';
import { HashService } from '@/infra/hash/hash.service';

@Injectable()
export class UserCodeService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly hashService: HashService,
  ) {}

  async create(userId: string, type: UserCodeType): Promise<string> {
    await this.typeormService.userCode.update(
      {
        userId,
        type,
        status: UserCodeStatus.PENDING,
      },
      {
        status: UserCodeStatus.INVALIDATED,
      },
    );

    const code = Code.generate(6);
    const hashedCode = await this.hashService.hash(code);
    const expiresIn = ClockUtil.getTimestampMilliseconds('30m');

    const userCode = this.typeormService.userCode.create({
      userId,
      type,
      code: hashedCode,
      expiresIn,
    });

    await this.typeormService.userCode.save(userCode);

    return code;
  }

  async confirm(
    userId: string,
    type: UserCodeType,
    code: string,
  ): Promise<boolean> {
    const isValid = await this.isValid(userId, type, code);

    if (!isValid) {
      return false;
    }

    const { id } = (await this.typeormService.userCode.findOne({
      select: ['id'],
      where: {
        userId,
        type,
        status: UserCodeStatus.PENDING,
      },
    }))!;

    await this.typeormService.userCode.update(id, {
      status: UserCodeStatus.USED,
    });

    return true;
  }

  async isValid(
    userId: string,
    type: UserCodeType,
    code: string,
  ): Promise<boolean> {
    const userCode = await this.typeormService.userCode.findOne({
      where: {
        userId,
        type,
        status: UserCodeStatus.PENDING,
      },
    });

    if (!userCode) {
      return false;
    }

    if (userCode.expiresIn < ClockUtil.getTimestampMilliseconds()) {
      await this.typeormService.userCode.update(userCode.id, {
        status: UserCodeStatus.INVALIDATED,
      });

      return false;
    }

    return await this.hashService.compare(code, userCode.code);
  }
}
