import { User } from "../entity/User";
import { createConfirmedEmailLink, sendEmailToUser } from "./emailService";
import fetch from "node-fetch";
import * as faker from "faker";
import { redis } from "../helpers/redis";
import { setupInitialization } from "../test/jest.setup";

let userId: string = "";
let link: string = "";

setupInitialization(() => {
	beforeAll(async () => {
		const user = await User.create({
			email: faker.internet.email(),
			password: faker.internet.password(),
		}).save();
		userId = user.id;

		link = await createConfirmedEmailLink(
			process.env.TEST_HOST as string,
			userId,
			redis
		);
	});
	describe("Make sure createConfirmationLink works and Redis delete the key", () => {
		it("Response status is 200", async () => {
			const res = await fetch(link);
			expect(res.status).toBe(200);
			const text = await res.text();
			expect(text).toEqual("ok");
		});
		it("Redis delete the id key", async () => {
			const user = await User.findOne({ where: { id: userId } });
			expect(user?.confirmed).toBeTruthy();
			const chunks = link.split("/");
			const key = chunks[chunks.length - 1];
			expect(await redis.get(key)).toBeNull();
		});
	});
	test("Send email attached confirmation link to user", async () => {
		const res: boolean = await sendEmailToUser(
			process.env.TEST_ACCOUNT_EMAIL as string,
			"google.com"
		);
		expect(res).toBeTruthy();
	});
});
