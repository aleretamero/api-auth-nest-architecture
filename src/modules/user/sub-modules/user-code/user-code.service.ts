import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { Injectable } from '@nestjs/common';
import { UserCodeStatus } from '@/modules/user/sub-modules/user-code/enums/user-code-status.enum';
import { UserCodeType } from '@/modules/user/sub-modules/user-code/enums/user-code-type.enum';
import { User } from '@/modules/user/entities/user.entity';
import { ClockUtil } from '@/common/shared/clock-util';
import { Code } from '@/common/shared/code';
import { HashService } from '@/infra/hash/hash.service';

@Injectable()
export class UserCodeService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly hashService: HashService,
  ) {}

  async create(user: User, type: UserCodeType): Promise<string> {
    await this.typeormService.userCode.update(
      {
        userId: user.id,
        type: type,
        status: UserCodeStatus.PENDING,
      },
      {
        status: UserCodeStatus.INVALIDATED,
      },
    );

    const code = Code.generate(6);
    const hashedCode = await this.hashService.hash(code);
    const expiresIn = ClockUtil.getTimestamp('30m');

    const userCode = this.typeormService.userCode.create({
      userId: user.id,
      type,
      code: hashedCode,
      expiresIn,
    });

    await this.typeormService.userCode.save(userCode);

    return code;
  }

  async confirm(
    user: User,
    type: UserCodeType,
    code: string,
  ): Promise<boolean> {
    const isValid = await this.isValid(user, type, code);

    if (!isValid) {
      return false;
    }

    const { id } = (await this.typeormService.userCode.findOne({
      select: ['id'],
      where: {
        user,
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
    user: User,
    type: UserCodeType,
    code: string,
  ): Promise<boolean> {
    const userCode = await this.typeormService.userCode.findOne({
      where: {
        user,
        type,
        status: UserCodeStatus.PENDING,
      },
    });

    if (!userCode) {
      return false;
    }

    if (userCode.expiresIn < ClockUtil.getTimestamp()) {
      await this.typeormService.userCode.update(userCode.id, {
        status: UserCodeStatus.INVALIDATED,
      });

      return false;
    }

    return await this.hashService.compare(code, userCode.code);
  }
}
