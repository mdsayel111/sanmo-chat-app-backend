import { TRole } from "../app/modules/user/user-interfaces";

// Extend the JwtPayload interface
declare module "jsonwebtoken" {
  export interface JwtPayload {
    phone: string;
    role: TRole;
    _id: string;
  }
}

declare module "express-serve-static-core" {
  export interface Request {
    user?: {
      phone: string;
      role: string;
      _id: string;
    };
  }
}

declare module "../app/interface/test.interface.ts" {
  interface MyModule {
    phone: string;
    role: string;
    _id: string;
  }
}

declare module "socket.io" {
  interface Socket {
    user?: JwtPayload; // or your custom decoded type
  }
}
