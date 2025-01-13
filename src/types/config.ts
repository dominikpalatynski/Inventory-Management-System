export interface IEnvironmentConfig {
    node: {
      env: string;
      port: number;
    };
    database: {
      url: string;
    };
  }