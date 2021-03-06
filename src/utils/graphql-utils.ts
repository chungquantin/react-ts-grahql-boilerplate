import { Session } from "express-session";
import { Redis } from "ioredis";
import { Request } from "express";

export interface SessionStorage extends Session {
	userId?: string;
}
export interface GQLResolverMap {
	[key: string]: {
		[key: string]: GQLResolverFunction;
	};
}

export type GQLResolverFunction = (
	parent: any,
	args: any,
	context: Context,
	info: any
) => any;

export type GQLMiddlewareFunction = (
	resolver: GQLResolverFunction,
	parent: any,
	args: any,
	context: Context,
	info: any
) => any;

export interface Context {
	redis: Redis;
	url: string;
	session: SessionStorage;
	req: Request;
}

export interface IServer {
	schema: any;
	context: () => Context;
}
