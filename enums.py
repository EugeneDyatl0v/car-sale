class Currency(Enum):
    USD = "USD"
    EUR = "EUR"
    RUB = "RUB"

class FuelType(Enum):
    PETROL = "PETROL"
    DIESEL = "DIESEL"
    ELECTRIC = "ELECTRIC"
    HYBRID = "HYBRID"

class Transmission(Enum):
    MANUAL = "MANUAL"
    AUTOMATIC = "AUTOMATIC"
    CVT = "CVT"

class BodyType(Enum):
    SEDAN = "SEDAN"
    SUV = "SUV"
    HATCHBACK = "HATCHBACK"
    WAGON = "WAGON"
    COUPE = "COUPE"

class DriveType(Enum):
    FWD = "FWD"
    RWD = "RWD"
    AWD = "AWD"