class Currency(Enum):
    USD = "USD"
    EUR = "EUR"
    RUB = "RUB"
    BYN = "BYN"

class FuelType(Enum):
    PETROL = "Бензин"
    DIESEL = "Дизель"
    ELECTRIC = "Электричество"
    HYBRID = "Гибрид"
    GAS = "Газ"

class Transmission(Enum):
    MANUAL = "Ручная"
    AUTOMATIC = "Автоматическая"
    CVT = "Робот"

class BodyType(Enum):
    SEDAN = "Седан"
    SUV = "Внедорожник"
    HATCHBACK = "Хетчбэк"
    WAGON = "Универсал"
    COUPE = "Купе"

class DriveType(Enum):
    FWD = "Передний"
    RWD = "Задний"
    AWD = "Полный"