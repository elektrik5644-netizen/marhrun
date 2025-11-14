export interface Trip {
    id: number;
    route_id: number;
    driver_id: number;
    vehicle_id: number;
    departure_time: Date;
    estimated_arrival_time: Date;
    available_seats: number;
    price: number;
    status: 'scheduled' | 'boarding' | 'in_progress' | 'completed' | 'cancelled';
    created_at: Date;
}
export declare class TripModel {
    static create(tripData: Omit<Trip, 'id' | 'created_at'>): Promise<Trip>;
    static findById(id: number): Promise<Trip | undefined>;
    static findByDriverAndDate(driverId: number, date: string): Promise<Trip[]>;
    static updateStatus(id: number, status: Trip['status']): Promise<Trip>;
    static findActiveByDriver(driverId: number): Promise<Trip | undefined>;
}
//# sourceMappingURL=Trip.d.ts.map