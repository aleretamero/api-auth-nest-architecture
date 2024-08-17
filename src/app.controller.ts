import { Get, Controller, Render } from '@nestjs/common';
import { IsPublic } from '@/common/decorators/is-public.decorator';
import { ApiExcludeController } from '@nestjs/swagger';
import environment from '@/configs/environment';

@Controller()
@ApiExcludeController()
export class AppController {
  @Get()
  @IsPublic()
  @Render('index')
  async root() {
    const url = `${environment.API_PORTFOLIO_URL}/projects/${environment.API_PORTFOLIO_PROJECT_ID}`;
    const token = environment.API_PORTFOLIO_TOKEN;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching project portfolio');
    }

    const project = await response.json();

    return {
      project,
      yearCreatedAt: 2024,
      currentYear: new Date().getFullYear(),
    };
  }
}
