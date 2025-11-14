import { Request, Response } from 'express';
export declare class TripController {
    static getTripSchedule(req: Request, res: Response): Promise<void>;
    static startTrip(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static completeTrip(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=tripController.d.ts.map