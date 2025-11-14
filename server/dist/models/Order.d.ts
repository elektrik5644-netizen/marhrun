export interface Order {
    id: number;
    passenger_id: number;
    trip_id: number;
    seats: number;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
    payment_method: 'cash' | 'card';
    payment_status: 'pending' | 'paid' | 'failed';
    created_at: Date;
}
export declare class OrderModel {
    static create(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order>;
    static findByPassenger(passengerId: number): Promise<Order[]>;
    static findByTrip(tripId: number): Promise<Order[]>;
    static updateStatus(id: number, status: Order['status']): Promise<Order>;
    static confirmPayment(orderId: number): Promise<Order>;
}
//# sourceMappingURL=Order.d.ts.map