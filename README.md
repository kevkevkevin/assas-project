How to Update Car Inventory (JSON)
Currently, the available cars are stored directly in the code as a "JSON Array" (a list of data). Whenever you want to add a new car, remove an old one, or change a price, you just need to edit these specific files.

1. Updating Cars on the Dashboard (Rentals Page)
This controls the cars that users see when they log in and click "Browse Cars" to rent.

File Location: app/dashboard/rentals/page.tsx

What to look for: Look near the top of the file (around line 9) for a block of code that starts with: const AVAILABLE_CARS = [

How to edit: You will see a list of cars wrapped in curly braces {}. To change a price, just change the number next to price:.

2. Updating Cars on the Home Page (Featured Cars)
This controls the cars shown to the public on your main landing page before they log in.

File Location: app/page.tsx (or components/FeaturedCars.tsx if you separated it).

What to look for: Look near the top of the file for a variable named const FEATURED_CARS = [ or const CARS = [.

How to edit: Just like the dashboard, you can edit the text inside the quotation marks "" or the numbers to update the public showcase.

📋 The Car Data Template
Whenever you want to add a brand new car to any of these lists, you just copy and paste this exact block of code, fill in your new details, and put a comma , at the end!

JavaScript
  { 
    id: "c7", // Make sure this ID is unique! (c7, c8, c9...)
    make: "Lucid", 
    model: "Air", 
    year: "2024", 
    color: "Quantum Grey", 
    price: 150, // No quotes around numbers!
    image: "https://link-to-your-car-image.com/image.jpg", 
    type: "Sedan", 
    seats: 5, 
    fuel: "electric", 
    transmission: "automatic" 
  },
🖼️ A Note on Car Images
For the image: property, you have two choices:

The Easy Way (Web Links): Find a picture of the car on Google, right-click it, select "Copy Image Address", and paste that link inside the quotation marks. (Example: "https://images.unsplash.com/photo-...")

The Professional Way (Local Files): Save your car picture as lucid.jpg. Drag and drop that file into the public folder in your code. Then, change the code to simply say: image: "/lucid.jpg".

⚠️ Golden Rules for Editing JSON:
Always use quotation marks "" for text (like "Toyota").

Never use quotation marks for numbers (like 150).

Always put a comma , at the very end of each car block, otherwise, the website will crash!
