import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { configureWunderGraphServer, type AuthenticationResponse } from 'fireboom-wundersdk/server';
import type { HooksConfig } from './generated/fireboom.hooks';
import type { InternalClient } from './generated/fireboom.internal.client';


export default configureWunderGraphServer<HooksConfig, InternalClient, {}>(() => ({
    hooks: {
        global: {
        },
        authentication: {
    
    
        },
        queries: {
        },
        mutations: {
        },
    },
    graphqlServers: []
}));