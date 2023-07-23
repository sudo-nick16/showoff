import { PrismaClient } from "@prisma/client";

const pc = new PrismaClient();

async function main() {
    let i = 0;
    setInterval(async () => {
        const event = await pc.outboxTable.create({
            data: {
                aggregateid: i.toString(),
                aggregatetype: "user",
                type: "user_created",
                payload: {
                    id: i.toString(),
                    username: "test",
                    email: "nikitsingh12@gmail.com"
                }
            }
        });
        if (!event) {
            console.log("error while creating event.");
        }
        console.log("created event: ", i);
        i++;
    }, 2000);
}

main() 
