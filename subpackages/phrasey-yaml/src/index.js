"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializer = exports.serializer = void 0;
const yaml_1 = __importDefault(require("yaml"));
exports.serializer = {
    extension: "yaml",
    serialize: (content) => yaml_1.default.stringify(content),
};
exports.deserializer = {
    deserialize: (content) => yaml_1.default.parse(content),
};
