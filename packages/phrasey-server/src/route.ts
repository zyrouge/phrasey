import { PhraseyServer } from ".";

export type PhraseyServerRoute = (server: PhraseyServer) => void;

export const createPhraseyServerRoute = (route: PhraseyServerRoute) => route;
