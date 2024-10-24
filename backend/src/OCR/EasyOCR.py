import cv2
import os
import easyocr
import re
import glob
from .ExtractInfo import OCRModel


class EasyOCRReader:
    def __init__(self):
        self.reader = easyocr.Reader(['en'])
        self.model = OCRModel()
        self.process_image = []

    def get_output(self, encoded_image_list):
        # Initialize model and process the list of encoded images
        self.model.initialiseModel(encoded_image_list)

        base_dir = os.path.dirname(__file__)  # Get the directory where the script is located
        cropped_images_dir = os.path.join(base_dir, 'cropped_images')  # Folder with cropped images

        # Check if the directory exists
        if not os.path.exists(cropped_images_dir):
            print(f"Error: Cropped images directory not found at {cropped_images_dir}")
            return []

        # List all image files in the cropped_images folder
        image_files = [f for f in os.listdir(cropped_images_dir) if f.startswith('Item') and f.endswith(('.png', '.jpg', '.jpeg'))]


        # Initialize a list to hold all items and prices
        all_items_and_prices = []

        # Process each cropped image file
        for image_file in image_files:
            image_path = os.path.join(cropped_images_dir, image_file)
            cropped_image = cv2.imread(image_path)

            if cropped_image is None:
                print(f"Error: Could not read image {image_file}")
                continue

            # Image Preprocessing (Grayscale, Contrast Normalization, CLAHE)
            gray_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
            stretched_image = cv2.normalize(gray_image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            clahe_image = clahe.apply(stretched_image)

            # Run EasyOCR on the preprocessed image
            result = self.reader.readtext(clahe_image)

            # Print the OCR result for debugging
            print(f"OCR result for {image_file}:")
            detected_texts = [text for _, text, _ in result]
            ocr_output = ' '.join(detected_texts)
            print(ocr_output)

            # Normalize and remove common headers from the OCR output
            headers = ["Descr", "ipt", "ion", "QTY", "Qty", "Quantity", "Description", "Amount", "Oty", "Descript","Qly"]
            for header in headers:
                ocr_output = ocr_output.replace(header, "").strip()

            # Define regex pattern to extract item descriptions and prices
            pattern = r"([A-Za-z0-9\s]+)\s+(\d+[.,]\d{2})"

            # Use regex to find all matches for items and prices in the OCR output
            matches = re.findall(pattern, ocr_output)

            # Extract items and prices from matches
            for match in matches:
                item = match[0].strip()  # Extract item description
                price_str= match[1].replace(',','.')  # Convert price to float
                price = float(price_str)  # Convert price to float
                all_items_and_prices.append({"item": item, "price": price})  # Store in list

        files = glob.glob(os.path.join(cropped_images_dir, '*'))

        # Delete each file in the folder
        for file in files:
            try:
                os.remove(file)
                print(f"Removed: {file}")
            except Exception as e:
                print(f"Error removing {file}: {e}")
        # Return the structured list of items and prices from all images
        return all_items_and_prices