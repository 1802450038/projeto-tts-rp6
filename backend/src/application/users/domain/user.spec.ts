import { describe, expect, test } from "vitest";
import { User } from "./user";

describe("Entity User", () => {
	test("should be able to create a user", () => {
		const props = {
			name: "test",
			email: "test@email.com",
			password: "12345678",
		};
		const sut = User.create({ props });
		expect(sut.isRight()).toBeTruthy();
	});

	test("should not be able to create a customer with invalid data", () => {
		const props = {
			name: "",
			email: "",
			password: "",
		};
		const sut = User.create({ props });
		expect(sut.isLeft()).toBeTruthy();
	});

	test("should not be able to create a customer with invalid email", () => {
		const props = {
			name: "test",
			email: "test.email.com",
			password: "12345678",
		};
		const sut = User.create({ props });
		expect(sut.isLeft()).toBeTruthy();
	});

	test("should not be able to create a customer with invalid password", () => {
		const props = {
			name: "test",
			email: "test@email.com",
			password: "",
		};
		const sut = User.create({ props });
		expect(sut.isLeft()).toBeTruthy();
	});
});
