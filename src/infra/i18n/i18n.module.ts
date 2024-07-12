import * as path from 'node:path';
import { Global, Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule as NestjsI18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { I18nService } from '@/infra/i18n/i18n.service';
import { FileSystem } from '@/common/helpers/file-system';

@Global()
@Module({
  imports: [
    NestjsI18nModule.forRootAsync({
      useFactory: async () => {
        await FileSystem.convertImportDefaultFilesToJSON(
          path.join(__dirname, 'locales'),
        );

        return {
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, 'locales'),
            watch: true,
          },
        };
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
  ],
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {}
