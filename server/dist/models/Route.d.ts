export interface Route {
    id: number;
    departure_city: string;
    departure_address: string;
    departure_lat: number;
    departure_lng: number;
    arrival_city: string;
    arrival_address: string;
    arrival_lat: number;
    arrival_lng: number;
    duration_minutes: number;
    base_price: number;
    is_active: boolean;
    created_at: Date;
}
export declare class RouteModel {
    static findAll(): Promise<Route[]>;
    static findById(id: number): Promise<Route | undefined>;
    static findByCities(departureCity: string, arrivalCity: string): Promise<Route[]>;
}
//# sourceMappingURL=Route.d.ts.map