import { PrismaClient, User } from "@prisma/client";
import { hashPassword } from "./utils";

export class UserRepo {
  constructor(private pc: PrismaClient) {
    this.pc = pc;
  }
  async getUserByEmail(email: string) {
    const user = await this.pc.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return user;
    }
    return undefined;
  }

  async getUserById(id: number) {
    const user = await this.pc.user.findUnique({
      where: {
        id: id,
      },
    });
    if (user) {
      return user;
    }
    return undefined;
  }

  async getUserByUsername(username: string) {
    const user = await this.pc.user.findUnique({
      where: {
        username: username,
      },
    });
    if (user) {
      return user;
    }
    return undefined;
  }

  async createUser(user: {username: string, name: string, email: string, password: string, img: string}) {
    const newUser = await this.pc.user.create({
      data: {
        username: user.username,
        name: user.name,
        email: user.email,
        password: await hashPassword(user.password),
        img: user.img,
      },
    });
    if (newUser) {
      return newUser;
    }
    return undefined;
  }

  async updateUser(user: User) {
    const updatedUser = await this.pc.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: user.username,
        name: user.name,
      },
    });
    if (updatedUser) {
      return updatedUser;
    }
    return undefined;
  }
}
