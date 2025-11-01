package donation.example.donation.system.type;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Unit {
    KG,
    GRAM,
    LITRE,
    ML,
    UNITS, // For items like cans or boxes
    LOAVES,
    OTHER;

    @JsonCreator
    public static Unit fromString(String value) {
        if (value == null) return null;
        try {
            return Unit.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return OTHER; // fallback to OTHER if the value doesn't match
        }
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
