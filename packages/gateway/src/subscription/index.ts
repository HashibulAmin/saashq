import { useServer } from 'graphql-ws/lib/use/ws';
import {
  DocumentNode,
  execute,
  ExecutionArgs,
  getOperationAST,
  GraphQLError,
  parse,
  subscribe,
  validate,
} from 'graphql';
import * as ws from 'ws';
import SubscriptionResolver from './SubscriptionResolver';
import { Disposable, SubscribeMessage } from 'graphql-ws';
import genTypeDefsAndResolvers from './genTypeDefsAndResolvers';
import * as http from 'http';
import { supergraphPath } from '../apollo-router/paths';
import * as fs from 'fs';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { apolloRouterPort } from '../apollo-router';
import { gql } from '@apollo/client/core';
import { getSubdomain } from '../util/subdomain';

let disposable: Disposable | undefined;

export async function stopSubscriptionServer() {
  if (disposable) {
    try {
      await disposable.dispose();
    } catch (e) {
      console.error(e);
    }
  }
}

export function makeSubscriptionSchema({ typeDefs, resolvers }: any) {
  if (!typeDefs || !resolvers) {
    throw new Error(
      'K vytvoření spustitelného schématu předplatného jsou vyžadovány jak `typeDefs`, tak `resolvery`.',
    );
  }
  const supergraph = fs.readFileSync(supergraphPath).toString();

  const supergraphTypeDefs = gql(supergraph);

  return makeExecutableSchema({
    typeDefs: [
      ...((supergraphTypeDefs && [supergraphTypeDefs]) as DocumentNode[]),
      typeDefs,
    ],
    resolvers,
  });
}

export async function startSubscriptionServer(httpServer: http.Server) {
  const wsServer = new ws.Server({
    server: httpServer,
    path: '/graphql',
  });

  const typeDefsResolvers = await genTypeDefsAndResolvers();

  if (!typeDefsResolvers) {
    return;
  }

  const { typeDefs, resolvers } = typeDefsResolvers;

  const schema = makeSubscriptionSchema({
    typeDefs,
    resolvers,
  });

  await stopSubscriptionServer();

  disposable = useServer(
    {
      execute,
      subscribe,
      context: (ctx, _msg: SubscribeMessage, _args: ExecutionArgs) => {
        const gatewayDataSource = new SubscriptionResolver(
          `http://127.0.0.1:${apolloRouterPort}`,
          ctx,
        );
        const subdomain = getSubdomain(ctx.extra.request);
        return { dataSources: { gatewayDataSource }, subdomain };
      },
      onSubscribe: async (
        _ctx,
        msg: SubscribeMessage,
      ): Promise<ExecutionArgs | readonly GraphQLError[] | void> => {
        const args = {
          schema,
          operationName: msg.payload.operationName,
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
        };

        const operationAST = getOperationAST(args.document, args.operationName);

        // Stops the subscription and sends an error message
        if (!operationAST) {
          return [new GraphQLError('Nelze identifikovat operaci')];
        }

        // Handle mutation and query requests
        if (operationAST.operation !== 'subscription') {
          return [
            new GraphQLError('Podporovány jsou pouze operace předplatného'),
          ];
        }

        // Validate the operation document
        const errors = validate(args.schema, args.document);

        if (errors.length > 0) {
          return errors;
        }
        // Ready execution arguments
        return args;
      },
    },
    wsServer,
  );
}
