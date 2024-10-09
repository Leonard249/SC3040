import cv2
import os
import easyocr
import re
import json

# Initialize EasyOCR Reader
reader = easyocr.Reader(['en'])

# Load the cropped image
image_path = 'OCR/cropped_images/Item.jpg'
cropped_image = cv2.imread(image_path)

# Convert the image to grayscale
gray_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
# Run EasyOCR on the image
result = reader.readtext(gray_image)

# Print the OCR result
print(f"OCR result for {os.path.basename(image_path)}:")

# Extract detected text from OCR result
detected_texts = [text for _, text, _ in result]
ocr_output = ' '.join(detected_texts)
print(ocr_output)
# Regular expression to find items with potential price formats
# Adjusted pattern to better capture prices in various formats
headers = ["QTY", "Qly", "Quantity", "Description", "Amount", "QTY Description Amount","Oty","Descript","Descript"]

# Normalize and remove possible headers from the output
for header in headers:
    ocr_output = ocr_output.replace(header, "").strip()

# Define the pattern for extracting items and prices
pattern = r"([A-Za-z0-9\s]+)\s+(\d+\.\d{2})"



# Find all matches in the OCR output
matches = re.findall(pattern, ocr_output)

# Extract items and prices
items_and_prices = []
for match in matches:
    item = match[0].strip()  # The item description (trimmed of extra spaces)
    price = float(match[1])   # The price as a float
    items_and_prices.append({"item": item, "price": price})  # Store as a dictionary

# Convert the result to JSON format
json_output = json.dumps(items_and_prices, indent=4)  # Convert to JSON with pretty print

# Print the JSON output
print(json_output)
