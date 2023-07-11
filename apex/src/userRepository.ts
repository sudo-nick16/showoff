import { PrismaClient } from "@prisma/client";

export class UserRepo {
  constructor(private pc: PrismaClient) {
    this.pc = pc;
  }
  async getUserByEmail(email: string) {
    if (!email) {
      return undefined;
    }
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
    if (!id) {
      return undefined;
    }
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
    if (!username) {
      return undefined;
    }
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

  async createUser(user: { username: string, name: string, email: string, img: string }) {
    const newUser = await this.pc.user.create({
      data: {
        username: user.username,
        name: user.name,
        email: user.email,
        img: user.img,
      },
    });
    if (newUser) {
      return newUser;
    }
    return undefined;
  }

  async updateUser(id: number, { username, name }: { username: string, name: string }) {
    const updatedUser = await this.pc.user.update({
      where: {
        id: id,
      },
      data: {
        username: username,
        name: name,
      },
    });
    if (updatedUser) {
      return updatedUser;
    }
    return undefined;
  }
}
