import cv2
import pytesseract
import os

image_path = 'OCR/cropped_images/Item_0.jpg'
cropped_image = cv2.imread(image_path)

text = pytesseract.image_to_string(cropped_image)

print(f"OCR result for {os.path.basename(image_path)}: {text}")
