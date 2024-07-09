import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { Injectable } from '@nestjs/common';
import { UserCode } from '@/modules/user-code/entities/user-code.entity';
import { UserCodeStatus } from '@/modules/user-code/enums/user-code-status.enum';
import { UserCodeType } from '@/modules/user-code/enums/user-code-type.enum';
import { User } from '@/modules/user/entities/user.entity';
import { ClockUtil } from '@/common/shared/clock-util';
import { Code } from '@/common/shared/code';

@Injectable()
export class UserCodeService {
  constructor(private readonly typeormService: TypeormService) {}

  async create(user: User, type: UserCodeType): Promise<UserCode> {
    const userCode = this.typeormService.userCode.create({
      user,
      type,
      code: Code.generate(6),
      expiresIn: ClockUtil.getTimestamp('30m'),
    });

    await this.typeormService.userCode
      .createQueryBuilder()
      .update(UserCode)
      .set({ status: UserCodeStatus.INVALIDATED })
      .where('user = :user', { user: user.id })
      .andWhere('id != :id', { id: userCode.id })
      .andWhere('type = :type', { type: type })
      .andWhere('status IN (:...status)', {
        status: [UserCodeStatus.PENDING, UserCodeStatus.VERIFIED],
      })
      .execute();

    await this.typeormService.userCode.save(userCode);

    return userCode;
  }
}
