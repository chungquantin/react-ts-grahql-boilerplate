import { GraphQLServer } from "graphql-yoga";
import { Redis } from "ioredis";
import { Request, Response } from "express";
import { User } from "../entity/User";

export const emailRoutes = (server: GraphQLServer) => ({
	confirmation: (redis: Redis) => {
		server.express.get("/confirm/:id", async (req: Request, res: Response) => {
			const { id } = req.params;
			const userId = await redis.get(id);
			if (userId) {
				await User.update({ id: userId as string }, { confirmed: true });
				redis.del(id);
				res.send("ok").status(200);
			} else {
				res.send("invalid");
			}
		});
	},
});
