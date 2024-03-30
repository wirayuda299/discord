import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { createUserSchema, idSchema } from '../../schema/zodSchema/user';
import { DatabaseService } from '../../services/database/database.service';
import { ValidationService } from '../validation/validation.service';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private validationService: ValidationService,
  ) {}

  async createUser(id: string, name: string, email: string, image: string) {
    try {
      const body = {
        id,
        name,
        image,
        email,
      };

      this.validationService.validate(createUserSchema, body);

      await this.databaseService.pool.query(
        `INSERT INTO USERS(id, username, image, email) VALUES('${id}', '${name}', '${image}', '${email}')`,
      );

      return {
        message: 'User created',
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllUser(id: string) {
    try {
      if (!id) throw new BadRequestException('Id is required');

      const users = await this.databaseService.pool.query(
        `SELECT * FROM USERS WHERE id != '${id}' ORDER BY created_at desc`,
      );

      return {
        data: users.rows,
        error: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<NotFoundException | any> {
    try {
      const idData = this.validationService.validate(idSchema, id);

      const user = await this.databaseService.pool.query(
        `select * from users where id= $1 `,
        [idData],
      );

      if (user.rows.length < 1) throw new NotFoundException('User not found');

      return user.rows;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(name: string, id: string) {
    try {
      const idData = this.validationService.validate(idSchema, id);

      const user = await this.getUserById(idData);
      if (user.status !== 404) {
        await this.databaseService.pool.query(
          `update users set username = $1 where id = $2`,
          [name, idData],
        );
        return {
          message: 'Updated',
          error: false,
        };
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const idData = this.validationService.validate(idSchema, id);

      const user = await this.getUserById(idData);
      if (user.status === 404) throw new NotFoundException('User not found');

      await this.databaseService.pool.query(
        `delete from users where id='${idData}'`,
      );

      return {
        message: `User with ID: ${id} has been deleted`,
      };
    } catch (error) {
      throw error;
    }
  }
}
