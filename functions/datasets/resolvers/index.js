const mapboxClient = require("@mapbox/mapbox-sdk");
const mapboxDatasets = require("@mapbox/mapbox-sdk/services/datasets");

const baseClient = mapboxClient({
  accessToken: process.env.MAPBOX_ACCESS_TOKEN,
});

const datasetsService = mapboxDatasets(baseClient);

const resolvers = {
  Query: {
    listDatasets: async (root, args, context) => {
      return datasetsService
        .listDatasets()
        .send()
        .then(
          (response) => {
            const datasets = response.body;
            return datasets;
          },
          (error) => {
            return error;
          }
        );
    },
    getMetadata: async (root, args, context) => {
      return datasetsService
        .getMetadata({
          datasetId: args.datasetId,
        })
        .send()
        .then((response) => {
          const datasetMetadata = response.body;
          return datasetMetadata;
        });
    },
    listFeatures: async (root, args, context) => {
      return datasetsService
        .listFeatures({
          datasetId: args.datasetId,
        })
        .send()
        .then((response) => {
          const features = response.body;
          return features;
        });
    },
    getFeature: async (root, args, context) => {
      return datasetsService
        .getFeature({
          datasetId: args.datasetId,
          featureId: args.featureId,
        })
        .send()
        .then((response) => {
          const feature = response.body;
          return feature;
        });
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
        .then((response) => {
          const dataset = response.body;
          return dataset;
        });
    },
    updateMetadata: async (root, args, context) => {
      return datasetsService
        .updateMetadata({
          datasetId: args.datasetId,
          ...args,
        })
        .send()
        .then((response) => {
          const datasetMetadata = response.body;
          return datasetMetadata;
        });
    },
    deleteDataset: async (root, args, context) => {
      return datasetsService
        .deleteDataset({
          datasetId: args.id,
        })
        .send()
        .then((response) => {
          const deleted = response.request.params.datasetId;
          return deleted;
        });
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
        .then((response) => {
          const feature = response.body;
          return feature;
        });
    },
    deleteFeature: async (root, args, context) => {
      return datasetsService
        .deleteFeature({
          datasetId: args.datasetId,
          featureId: args.featureId,
        })
        .send()
        .then((response) => {
          const deleted = response.request.params.featureId;
          return deleted;
        });
    },
  },
};

module.exports = {
  resolvers,
};
