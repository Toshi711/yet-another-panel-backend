import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as passport from "passport";
import { TypeormStore } from "typeorm-store";
import { Session } from "./typeorm/Session.entity";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const repository = app.get(AppModule).getDataSource().getRepository(Session);

  app.use(
    session({
      secret: "askdmasld",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000 * 24,
      }, 
      store: new TypeormStore({ repository }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("DSSYS example")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
