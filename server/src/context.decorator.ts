import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { IncomingMessage, ServerResponse } from "http";
import { PayloadType } from "./auth/jwt.payload";

export const Context = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        let res = ctx.getContext() as ContextType;   
        return res;
	},
);

export type ContextType = {
    req: IncomingMessage & { res: ServerResponse, user?: PayloadType }
}