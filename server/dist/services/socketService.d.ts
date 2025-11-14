declare class SocketService {
    private io;
    constructor(server: any);
    private setupSocketEvents;
    sendLocationUpdate(tripId: number, location: any): void;
    notifyTripStarted(tripId: number): void;
    notifyTripCompleted(tripId: number): void;
}
export default SocketService;
//# sourceMappingURL=socketService.d.ts.map