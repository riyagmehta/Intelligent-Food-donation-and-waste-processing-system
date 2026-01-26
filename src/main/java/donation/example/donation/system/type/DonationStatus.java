package donation.example.donation.system.type;

public enum DonationStatus {
    PENDING,     // Donor created, waiting for staff approval
    REJECTED,    // Staff rejected the donation
    COLLECTED,   // Staff accepted and collected
    ASSIGNED,    // Delivery assigned to driver
    IN_TRANSIT,  // Driver picked up, on the way
    DELIVERED,   // Delivered to destination
    PROCESSED    // Fully processed/distributed
}
