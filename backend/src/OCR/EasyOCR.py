import cv2
import os
import easyocr
import re

from .ExtractInfo import OCRModel


class EasyOCRReader:
    def __init__(self):
        self.reader = easyocr.Reader(['en'])
        self.model = OCRModel()
        self.process_image = []

    def get_output(self, encoded_image_list):
        # Initialize EasyOCR Reader
        # Load the cropped image
        self.model.initialiseModel(encoded_image_list)

        base_dir = os.path.dirname(__file__)  # Get the directory where the script is located
        output_dir = os.path.join(base_dir, 'cropped_images', 'Item.jpg')
        cropped_image = cv2.imread(output_dir)

        # Image Preprocessing
        gray_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
        stretched_image = cv2.normalize(gray_image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        clahe_image = clahe.apply(stretched_image)
        
        # Run EasyOCR on the image
        result = self.reader.readtext(clahe_image)

        # Print the OCR result
        print(f"OCR result for {os.path.basename(output_dir)}:")

        # Extract detected text from OCR result
        detected_texts = [text for _, text, _ in result]
        ocr_output = ' '.join(detected_texts)
        print(ocr_output)
        # Regular expression to find items with potential price formats
        # Adjusted pattern to better capture prices in various formats
        headers = ["Descr","ipt","ion","QTY", "Qly", "Quantity", "Description", "Amount", "QTY Description Amount","Oty","Descript","Descript"]

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

        return items_and_prices
