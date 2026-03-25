"""
Generate 1000+ realistic tech products and insert them into MongoDB.

Usage:
    pip install pymongo python-dotenv
    python generate_products.py

The script reads MONGO_URL from backend/.env (or you can set it below).
It fetches existing categories from the DB and distributes products across them.
"""

import random
import math
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import dotenv_values

# ── Config ──────────────────────────────────────────────────────────────────
ENV_PATH = "../.env"          # relative to this script
PRODUCTS_PER_CATEGORY = 130   # 8 categories × 130 = 1 040 products
CLEAR_EXISTING = False        # set True to wipe products before inserting

config = dotenv_values(ENV_PATH)
MONGO_URL = config.get("MONGO_URL", "mongodb://localhost:27017/eshop")

# ── Category-specific data ──────────────────────────────────────────────────
CATEGORY_DATA = {
    "Phones": {
        "brands": ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Sony", "Motorola", "Nothing"],
        "adjectives": ["Pro", "Ultra", "Plus", "Max", "Lite", "Edge", "Neo", "SE"],
        "models": ["Galaxy", "Pixel", "Redmi", "Nord", "Xperia", "Moto", "Phone"],
        "price_range": (199, 1399),
        "descriptions": [
            "Flagship smartphone with an advanced triple-camera system and all-day battery life.",
            "5G-ready phone featuring a stunning AMOLED display and fast wireless charging.",
            "Compact powerhouse with AI-enhanced photography and premium build quality.",
            "Ultra-thin design packed with the latest processor and satellite connectivity.",
            "Gaming phone with a 165 Hz display, active cooling, and dedicated gaming triggers.",
        ],
        "image_seeds": ["iphone", "smartphone", "mobile", "phone", "android"],
    },
    "Tablets": {
        "brands": ["Apple", "Samsung", "Microsoft", "Lenovo", "Huawei", "Amazon", "Google"],
        "adjectives": ["Pro", "Ultra", "Plus", "Air", "Go", "SE", "Max"],
        "models": ["iPad", "Galaxy Tab", "Surface", "Tab", "MatePad", "Fire", "Pixel Tablet"],
        "price_range": (129, 1799),
        "descriptions": [
            "Versatile tablet with a liquid Retina display perfect for creative professionals.",
            "10-inch tablet with an optional keyboard cover, ideal for work and entertainment.",
            "Kids' tablet with parental controls, durable casing, and educational content.",
            "2-in-1 tablet with a detachable keyboard and stylus for ultimate productivity.",
            "Lightweight tablet with Wi-Fi 6E, 5G support, and an 8 000 mAh battery.",
        ],
        "image_seeds": ["tablet", "ipad", "surface", "digital-tablet"],
    },
    "Wearables": {
        "brands": ["Apple", "Samsung", "Garmin", "Fitbit", "Xiaomi", "Amazfit", "Fossil", "Withings"],
        "adjectives": ["Pro", "Ultra", "Active", "Classic", "SE", "Sport", "Health"],
        "models": ["Watch", "Band", "Fit", "Sense", "Versa", "Forerunner", "Fenix"],
        "price_range": (49, 799),
        "descriptions": [
            "Smartwatch with ECG, SpO2 monitoring, and crash detection for 24/7 health tracking.",
            "Fitness tracker with 14-day battery life, GPS, and sleep coaching.",
            "Luxury smartwatch combining traditional craftsmanship with smart notifications.",
            "Running watch with advanced training metrics, route planning, and music storage.",
            "Kids' GPS watch with SOS calling, safe-zone alerts, and step tracking.",
        ],
        "image_seeds": ["smartwatch", "watch", "wearable", "fitness-tracker"],
    },
    "Laptops": {
        "brands": ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Microsoft", "Razer", "Acer"],
        "adjectives": ["Pro", "Ultra", "Plus", "Air", "Gaming", "Creator", "Business"],
        "models": ["MacBook", "XPS", "Spectre", "ThinkPad", "ZenBook", "Surface Laptop", "Blade"],
        "price_range": (399, 3499),
        "descriptions": [
            "Ultra-slim laptop with a 4K OLED display and an all-day 18-hour battery.",
            "Business laptop with military-grade durability, fingerprint reader, and vPro chip.",
            "Creator laptop featuring a wide color-gamut display and discrete GPU for rendering.",
            "Gaming laptop with a 240 Hz QHD display, RTX graphics, and MUX switch.",
            "2-in-1 convertible with a detachable keyboard, stylus support, and LTE.",
        ],
        "image_seeds": ["laptop", "macbook", "computer", "notebook"],
    },
    "Gaming": {
        "brands": ["Sony", "Microsoft", "Nintendo", "Razer", "SteelSeries", "Logitech", "ASUS ROG", "Corsair"],
        "adjectives": ["Pro", "Elite", "Ultra", "Gaming", "RGB", "Wireless", "Tournament"],
        "models": ["Controller", "Headset", "Chair", "Monitor", "Keyboard", "Mouse", "Console", "GPU"],
        "price_range": (29, 2499),
        "descriptions": [
            "Pro gaming controller with adjustable trigger stops and back-paddle remapping.",
            "7.1 surround-sound headset with noise-cancelling mic and 30-hour battery.",
            "144 Hz curved gaming monitor with 1 ms response time and FreeSync Premium.",
            "Mechanical gaming keyboard with per-key RGB and hot-swappable switches.",
            "High-DPS gaming mouse with 8 programmable buttons and wireless charging dock.",
        ],
        "image_seeds": ["gaming", "controller", "console", "esports", "joystick"],
    },
    "Camera & Photography": {
        "brands": ["Sony", "Canon", "Nikon", "Fujifilm", "Panasonic", "Olympus", "Leica", "DJI"],
        "adjectives": ["Pro", "Ultra", "Full-Frame", "Mirrorless", "DSLR", "Cinema", "Compact"],
        "models": ["Alpha", "EOS", "Z-Series", "X-T", "Lumix", "OM-D", "M-Series", "Osmo"],
        "price_range": (149, 5999),
        "descriptions": [
            "Full-frame mirrorless camera with 50 MP sensor, in-body stabilization, and 8K video.",
            "Compact point-and-shoot camera with a 1-inch sensor and 15× optical zoom.",
            "Cinema camera recording 6K RAW internally with ND filters and dual native ISO.",
            "Action camera with 4K/120fps, waterproof to 10 m, and HyperSmooth 5.0 stabilization.",
            "Professional telephoto lens with fluorite elements and optical image stabilization.",
        ],
        "image_seeds": ["camera", "photography", "lens", "dslr", "mirrorless"],
    },
    "Audio & Video": {
        "brands": ["Sony", "Bose", "Sennheiser", "Apple", "JBL", "Sonos", "Bang & Olufsen", "Samsung"],
        "adjectives": ["Pro", "Signature", "Studio", "Wireless", "Noise-Cancelling", "Hi-Fi", "Premium"],
        "models": ["Headphones", "Earbuds", "Speaker", "Soundbar", "Amplifier", "DAC", "Subwoofer"],
        "price_range": (29, 2999),
        "descriptions": [
            "Over-ear headphones with industry-leading active noise cancellation and 30-hour battery.",
            "True wireless earbuds with adaptive ANC, spatial audio, and water resistance.",
            "Portable Bluetooth speaker with 360° sound, 24-hour battery, and IP67 rating.",
            "Dolby Atmos soundbar with wireless subwoofer and rear speakers for immersive home cinema.",
            "Hi-Fi desktop speakers with class-D amplifiers and aptX Adaptive Bluetooth.",
        ],
        "image_seeds": ["headphones", "speaker", "audio", "earbuds", "music"],
    },
    "Peripherals": {
        "brands": ["Logitech", "Razer", "Corsair", "Apple", "Microsoft", "Keychron", "Anker", "Belkin"],
        "adjectives": ["Pro", "Wireless", "Ergonomic", "Mechanical", "Gaming", "Silent", "Compact"],
        "models": ["Keyboard", "Mouse", "Webcam", "Hub", "Mousepad", "Monitor Arm", "Docking Station"],
        "price_range": (19, 599),
        "descriptions": [
            "Ergonomic wireless keyboard reducing wrist strain with 3-year battery life.",
            "Precision mouse with 8 000 DPI sensor, 6 programmable buttons, and silent clicks.",
            "4K webcam with built-in ring light, AI framing, and stereo microphones.",
            "12-in-1 USB-C docking station delivering 100 W PD, dual 4K output, and Gigabit Ethernet.",
            "XXL desk mat with rubberized base, cable management, and fast-charging wireless zone.",
        ],
        "image_seeds": ["keyboard", "mouse", "webcam", "peripheral", "computer-accessory"],
    },
}

# ── Helpers ──────────────────────────────────────────────────────────────────
def random_image(seed_keyword: str, n: int) -> str:
    """Return a deterministic picsum photo URL seeded by keyword+index."""
    return f"https://picsum.photos/seed/{seed_keyword}-{n}/600/400"

def random_rating() -> float:
    """Weighted rating: most products score between 3.5 and 5."""
    return round(random.choices(
        [round(random.uniform(1.0, 2.9), 1),
         round(random.uniform(3.0, 3.9), 1),
         round(random.uniform(4.0, 4.9), 1),
         5.0],
        weights=[3, 20, 60, 17]
    )[0], 1)

def random_date(start_days_ago=365, end_days_ago=1):
    """Random datetime in the past year."""
    delta = random.randint(end_days_ago, start_days_ago)
    return datetime.utcnow() - timedelta(days=delta)

def build_product(category_id, cat_name: str, index: int) -> dict:
    data = CATEGORY_DATA[cat_name]
    brand = random.choice(data["brands"])
    adj   = random.choice(data["adjectives"])
    model = random.choice(data["models"])
    seed  = random.choice(data["image_seeds"])

    # Build a realistic unique name: Brand + Model + Adjective + year/generation
    year = random.choice([2022, 2023, 2024, 2025])
    name = f"{brand} {model} {adj} {year} – Gen {random.randint(1, 5)}"

    price_min, price_max = data["price_range"]
    price = round(random.uniform(price_min, price_max), 2)

    count_in_stock = random.choices(
        [0, random.randint(1, 10), random.randint(11, 100), random.randint(101, 500)],
        weights=[5, 25, 50, 20]
    )[0]

    num_reviews = random.randint(0, 1200)
    rating = random_rating() if num_reviews > 0 else 0

    created_at = random_date()

    return {
        "name":         name,
        "image":        random_image(seed, index),
        "brand":        brand,
        "quantity":     random.randint(1, 500),
        "category":     category_id,
        "description":  random.choice(data["descriptions"]),
        "reviews":      [],
        "rating":       rating,
        "numReviews":   num_reviews,
        "price":        price,
        "countInStock": count_in_stock,
        "createdAt":    created_at,
        "updatedAt":    created_at,
    }

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    client = MongoClient(MONGO_URL)
    db = client.get_default_database()

    # Fetch categories
    categories = list(db["categories"].find({}))
    if not categories:
        print("❌  No categories found in DB. Run the seeder first.")
        return

    print(f"✅  Found {len(categories)} categories:")
    for c in categories:
        print(f"    {c['name']} → {c['_id']}")

    if CLEAR_EXISTING:
        deleted = db["products"].delete_many({})
        print(f"🗑   Cleared {deleted.deleted_count} existing products.")

    products = []
    global_index = 0

    for cat in categories:
        cat_name = cat["name"]
        if cat_name not in CATEGORY_DATA:
            print(f"⚠️   No template for category '{cat_name}', skipping.")
            continue

        for _ in range(PRODUCTS_PER_CATEGORY):
            products.append(build_product(cat["_id"], cat_name, global_index))
            global_index += 1

    random.shuffle(products)          # mix categories so pagination looks natural

    result = db["products"].insert_many(products)
    print(f"\n✅  Inserted {len(result.inserted_ids)} products into MongoDB.")
    print(f"    Total products in collection: {db['products'].count_documents({})}")
    client.close()

if __name__ == "__main__":
    main()
