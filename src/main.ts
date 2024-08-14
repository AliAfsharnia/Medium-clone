import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder().addBearerAuth()
  .setTitle('Medium Clone')
  .setDescription('a practice project')
  .setVersion('1.0')
  .addTag('medium')
  .build();

const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
