## 🚗 How to Update the Car Inventory (JSON)

The AutoSettle platform currently utilizes static JSON arrays for lightning-fast, serverless rendering of the available and featured vehicle inventory. Follow this guide to add, edit, or remove vehicles across the platform.

### 📂 1. File Locations

Depending on which view you want to update, locate the corresponding file in the codebase:

* **Dashboard Rentals (User Portal):** `app/dashboard/rentals/page.tsx`
    * *Search for:* `const AVAILABLE_CARS = [`
* **Public Landing Page (Featured Cars):** `app/page.tsx`
    * *Search for:* `const FEATURED_CARS = [`

---

### 📝 2. The Data Structure (Adding a Car)

To add a brand new vehicle to the inventory, copy the template below and paste it inside the target array. 

```javascript
  { 
    id: "c7", // 🔴 MUST BE UNIQUE! (e.g., c7, c8, c9)
    make: "Lucid", 
    model: "Air", 
    year: "2024", 
    color: "Quantum Grey", 
    price: 150, // 🟢 Integer only (No quotes)
    image: "/images/lucid.jpg", 
    type: "Sedan", 
    seats: 5, 
    fuel: "electric", 
    transmission: "automatic" 
  },
