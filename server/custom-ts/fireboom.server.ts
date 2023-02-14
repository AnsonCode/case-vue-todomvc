import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { configureWunderGraphServer, type AuthenticationResponse } from 'fireboom-wundersdk/server';
import type { HooksConfig } from './generated/fireboom.hooks';
import type { InternalClient } from './generated/fireboom.internal.client';

    

export default configureWunderGraphServer<HooksConfig, InternalClient, {}>(() => ({
   hooks:{  authentication: {
				
            }, queries:{},mutations:{}, },  graphqlServers: [{
			apiNamespace: "gql",
			serverName: "gql",
			enableGraphQLEndpoint:true,
			schema: new GraphQLSchema({
				query: new GraphQLObjectType({
					name: 'RootQueryType',
					fields: {
						hello: {
							type: GraphQLString,
							resolve() {
								return 'world';
							},
						},
					},
				}),
			}),
		},]
}));
