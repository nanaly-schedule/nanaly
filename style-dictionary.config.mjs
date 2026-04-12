import {
  expandTypesMap,
  getTransforms,
  register,
} from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";

register(StyleDictionary, {
  platform: "ts",
});

export default {
  source: ["init/styles/tokens.json"],
  preprocessors: ["tokens-sync"],
  expand: {
    typesMap: expandTypesMap,
  },
  platforms: {
    js: {
      transforms: [...getTransforms({ platform: "ts" }), "name/camel"],
      buildPath: "init/styles/",
      files: [
        {
          destination: "tokens.ts",
          format: "javascript/es6",
        },
      ],
    },
  },
};
