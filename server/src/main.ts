import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { RoleGuard } from './role/role.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // const reflector = app.get( Reflector );
    // app.useGlobalGuards(new RolesGuard(reflector));

    await app.listen(5000);
}
bootstrap();
