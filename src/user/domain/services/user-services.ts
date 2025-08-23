import { JwtService } from "@nestjs/jwt";
import { EnvService } from "src/app/modules/env/services/env";
import { UserPostgresRepository } from "src/user/infrastructure/postgres/repository/user";
import { FindUserByEmail } from "./find-user-by-email";
import { User } from "../entities/user";
import { Injectable } from "@nestjs/common";
import { AccessTokenVerificator } from "./access-token-verificator";

@Injectable()
export class UserServices {
  constructor(
    private readonly repository: UserPostgresRepository,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    const service = new FindUserByEmail(this.repository);
    return service.execute({ email: email });
  }

  verifyToken(token: string): Promise<User> {
    const service = new AccessTokenVerificator(
      this.jwtService,
      this.envService,
      this.repository,
    );

    return service.execute({ token: token });
  }
}
