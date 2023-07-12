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

  async createUser(user: {
    username: string;
    name: string;
    email: string;
    img: string;
  }) {
    const newUser = await this.pc.user.create({
      data: {
        username: user.username,
        name: user.name,
        email: user.email,
        img: user.img,
      },
    });
    console.log({ newUser })
    if (newUser) {
      try {
        const event = await this.pc.event.create({
          data: {
            type: "user_created",
            data: {
              id: newUser.id,
              username: newUser.username,
              email: newUser.email,
            },
          },
        });
        if (!event) {
          console.log("Error creating event");
        }
      } catch (err) {
        console.log("Error creating event");
      }
      return newUser;
    }
    return undefined;
  }

  async updateUser(
    id: number,
    { username, name }: { username: string; name: string }
  ) {
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
      try {
        const event = await this.pc.event.create({
          data: {
            type: "user_updated",
            data: {
              id: updatedUser.id,
              username: updatedUser.username,
              email: updatedUser.email,
            },
          },
        });
        if (!event) {
          console.log("Error creating update_user_event");
        }
      } catch (err) {
        console.log("Error creating update_user_event");
      }
      return updatedUser;
    }
    return undefined;
  }
}
