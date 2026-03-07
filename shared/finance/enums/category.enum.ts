/**
 * These categories are supposed to cover things that don't have reoccurring payments with fixed amounts and things
 * that it makes sense to define budgets for. They don't need to cover everything because of that.
 */
export enum Category {
    // LEISURE
    TRAVEL = "travel",
    HOBBIES = "hobbies",
    PARTYING = "partying",
    ENTERTAINMENT = "entertainment",
    SPORTS_AND_OUTDOORS = "sports_and_outdoors",

    // FOOD
    GROCERIES = "groceries",
    FOOD_DELIVERY = "food_delivery",
    EATING_OUT = "eating_out",

    // HOUSEHOLD
    FURNITURE = "furniture",
    GARDEN_AND_PLANTS = "garden_and_plants",
    HOME_SUPPLIES = "home_supplies",
    PERSONAL_CARE = "personal_care",
    PETS = "pets",
    REPAIRS = "home_repairs",

    // TRANSPORTATION
    PUBLIC_TRANSIT = "public_transit",
    BIKE = "bike",
    CAR = "car",
    MOTORBIKE = "motorbike",

    // SHOPPING
    CLOTHING = "clothing",
    ELECTRONICS = "electronics",
    BOOKS = "books",
    GAMING = "gaming",
    PRESENTS = "presents",

    // OTHER
    ACCOUNT_TRANSFER = "account_transfer",
    EDUCATION = "education",
    CHILDCARE = "childcare",
    INVESTMENTS = "investments",
    DONATIONS = "donations",
    MEDICATION = "medication",
    MISCELLANEOUS = "miscellaneous",
}
