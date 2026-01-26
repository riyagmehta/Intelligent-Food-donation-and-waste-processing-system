package donation.example.donation.system.type;

public enum DeliveryStatus {
    ASSIGNED,    // Delivery created, waiting for driver to pick up
    PICKED_UP,   // Driver picked up from center
    IN_TRANSIT,  // On the way to recipient
    DELIVERED,   // Delivered to recipient
    CANCELLED    // Delivery cancelled
}