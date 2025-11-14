import { Request, Response } from 'express';
export declare class RouteController {
    static getAllRoutes(req: Request, res: Response): Promise<void>;
    static getRouteById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getRoutesByCities(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=routeController.d.ts.map