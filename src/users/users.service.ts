import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { faker } from '@faker-js/faker';
import { QueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  // async onModuleInit() {
  //   const count = await this.userModel.countDocuments();
  //   if (count === 0) {
  //     const dataToUsers: any[] = [];
  //     for (let i = 0; i <= 30000; i++) {
  //       const firstName = faker.person.firstName();
  //       const lastName = faker.person.lastName();
  //       const gender = faker.person.sex();
  //       const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@example.com`;
  //       const age = faker.number.int({ min: 0, max: 100 });

  //       dataToUsers.push({
  //         firstName,
  //         lastName,
  //         gender,
  //         email,
  //         age,
  //       });
  //     }
  //     await this.userModel.insertMany(dataToUsers);
  //     console.log('inserted successfully');
  //   }
  // }

  async create({ email, firstName, gender, lastName, age }: CreateUserDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('Email already exists');
    }

    const newUser = await this.userModel.create({
      email,
      lastName,
      firstName,
      age,
      gender,
    });
    return { message: 'created successfully', newUser };
  }

  async findAll({
    page,
    take,
    ageFrom,
    ageTo,
    age,
    firstName,
    gender,
  }: QueryParamsDto) {
    const filter: any = {};

    if (ageFrom && !age) {
      filter.age = { ...filter.age, $gte: ageFrom };
    }
    if (ageTo && !age) {
      filter.age = { ...filter.age, $lte: ageTo };
    }
    if (age && !ageFrom && !ageTo) {
      filter.age = { $eq: age };
    }
    if (firstName) {
      filter.firstName = { $regex: firstName, $options: 'i' };
    }
    if (gender) {
      filter.gender = { $regex: `^${gender}`, $options: 'i' };
    }

    return await this.userModel
      .find(filter)
      .skip((page - 1) * take)
      .limit(take);
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID provided');
    }
    const existUser = await this.userModel.findById(id);
    if (!existUser) {
      throw new NotFoundException('User not found');
    }
    return existUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID provided');
    }

    const updated = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User updated successfully', user: updated };
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID provided');
    }
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully', user: deletedUser };
  }

  async countAllUsers() {
    const userSchemaCount = await this.userModel.countDocuments();
    return userSchemaCount;
  }
}
