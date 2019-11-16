const { ApolloServer, gql } = require("apollo-server-lambda")
const mapboxClient = require("@mapbox/mapbox-sdk")
const mapboxDatasets = require("@mapbox/mapbox-sdk/services/datasets")

const baseClient = mapboxClient({
  accessToken: process.env.MAPBOX_ACCESS_TOKEN,
})

const datasetsService = mapboxDatasets(baseClient)

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Coordinates
  scalar Bounds

  type Dataset {
    owner: String
    id: ID!
    name: String
    description: String
    created: String
    modified: String
    features: Int
    size: Int
    bounds: Bounds
  }

  type FeatureProps {
    name: String
    description: String
  }

  type FeatureGeometry {
    coordinates: Coordinates!
    type: String!
  }

  type Feature {
    type: String!
    properties: FeatureProps
    geometry: FeatureGeometry
    id: ID!
  }

  type FeatureCollection {
    type: String!
    features: [Feature]
  }

  type Query {
    listDatasets: [Dataset]
    listFeatures(datasetId: String!): FeatureCollection
    getMetadata(datasetId: String!): Dataset
    getFeature(datasetId: String!, featureId: String!): Feature
  }

  type Mutation {
    createDataset(name: String!, description: String): Dataset
    deleteDataset(id: String!): String
    updateMetadata(
      datasetId: String!
      name: String
      description: String
    ): Dataset
    putFeature(
      datasetId: String!
      featureId: String
      name: String!
      description: String
      lon: Float!
      lat: Float!
    ): Feature
    deleteFeature(datasetId: String!, featureId: String!): String
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    listDatasets: async (root, args, context) => {
      return datasetsService
        .listDatasets()
        .send()
        .then(
          response => {
            const datasets = response.body
            console.log(datasets)
            return datasets
          },
          error => {
            return error
          }
        )
    },
    getMetadata: async (root, args, context) => {
      return datasetsService
        .getMetadata({
          datasetId: args.datasetId,
        })
        .send()
        .then(response => {
          const datasetMetadata = response.body
          console.log(datasetMetadata)
          return datasetMetadata
        })
    },
    listFeatures: async (root, args, context) => {
      return datasetsService
        .listFeatures({
          datasetId: args.datasetId,
        })
        .send()
        .then(response => {
          const features = response.body
          console.log(features)
          return features
        })
    },
    getFeature: async (root, args, context) => {
      return datasetsService
        .getFeature({
          datasetId: args.datasetId,
          featureId: args.featureId,
        })
        .send()
        .then(response => {
          const feature = response.body
          console.log(feature)
          return feature
        })
    },
  },
  Mutation: {
    createDataset: async (root, args, context) => {
      return datasetsService
        .createDataset({
          name: args.name,
          description: args.description,
        })
        .send()
        .then(response => {
          const dataset = response.body
          console.log(dataset)
          return dataset
        })
    },
    updateMetadata: async (root, args, context) => {
      return datasetsService
        .updateMetadata({
          datasetId: args.datasetId,
          ...args,
        })
        .send()
        .then(response => {
          const datasetMetadata = response.body
          console.log(datasetMetadata)
          return datasetMetadata
        })
    },
    deleteDataset: async (root, args, context) => {
      return datasetsService
        .deleteDataset({
          datasetId: args.id,
        })
        .send()
        .then(response => {
          const deleted = response.request.params.datasetId
          console.log(deleted)
          return deleted
        })
    },
    putFeature: async (root, args, context) => {
      return datasetsService
        .putFeature({
          datasetId: args.datasetId,
          featureId: args.featureId,
          feature: {
            type: "Feature",
            properties: { name: args.name, description: args.description },
            geometry: {
              type: "Point",
              coordinates: [args.lon, args.lat],
            },
          },
        })
        .send()
        .then(response => {
          const feature = response.body
          console.log(feature)
          return feature
        })
    },
    deleteFeature: async (root, args, context) => {
      return datasetsService
        .deleteFeature({
          datasetId: args.datasetId,
          featureId: args.featureId,
        })
        .send()
        .then(response => {
          const deleted = response.request.params.featureId
          console.log(deleted)
          return deleted
        })
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // set to true if you want to see the Playground
  playground: true, // set to true if you want to see the Playground
})

exports.handler = server
  .createHandler
  //   {
  //   cors: {
  //     origin: "*", // <- allow request from all domains
  //     credentials: true, // <- enable CORS response for requests with credentials (cookies, http authentication)
  //   },
  // }
  ()
