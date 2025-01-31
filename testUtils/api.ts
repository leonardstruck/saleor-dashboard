import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { getApiUrl } from "@dashboard/config";
import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import FSPersister from "@pollyjs/persister-fs";
import { createFetch } from "@saleor/sdk";
import path from "path";
import { setupPolly } from "setup-polly-jest";

function setupApi() {
  setupPolly({
    adapters: [NodeHttpAdapter],
    matchRequestsBy: {
      headers: false,
      url: {
        hash: false,
        hostname: false,
        password: false,
        pathname: false,
        port: false,
        protocol: false,
        query: false,
        username: false,
      },
    },
    persister: FSPersister,
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "../recordings"),
      },
    },
  });
  const cache = new InMemoryCache();
  const link = new BatchHttpLink({
    fetch: createFetch(),
    uri: getApiUrl(),
  });
  const apolloClient = new ApolloClient({
    cache,
    link,
  });

  return apolloClient;
}

export default setupApi;
