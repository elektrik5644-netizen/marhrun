import { Request, Response } from 'express';
export declare class OrderController {
    static createOrder(req: Request, res: Response): Promise<void>;
    static getMyOrders(req: Request, res: Response): Promise<void>;
    static cancelOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=orderController.d.ts.map