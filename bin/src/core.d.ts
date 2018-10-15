export interface Core {
    getModels(): any;
    connectActiveDataSources(dataSources: JSON): any;
    disconnectActiveDataSources(dataSources: JSON): any;
    buildSchema(schemaName: String, pubsub: any, schemaDirectives: JSON): any;
}
export declare class Core implements Core {
    makeExecutableSchema: any;
    models: any;
    graphQLSchemas: Promise<void>;
    constructor(config: any, makeExecutableSchema: any);
    getSchemas(): Promise<void>;
}
