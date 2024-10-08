from ultralytics import YOLO
import cv2
import os

model = YOLO('OCR/Receipt.pt')
results = model.predict("OCR/Logging/Input/Test.jpg")
image = cv2.imread("OCR/Logging/Input/Test.jpg")

 #Create a directory to save cropped images
output_dir = "OCR/cropped_images"
os.makedirs(output_dir, exist_ok=True)

# Iterate over the predictions to crop and save bounding boxes
for result in results:
    boxes = result.boxes.xyxy  # Get the bounding boxes [x1, y1, x2, y2]
    confidences = result.boxes.conf  # Get confidence scores
    class_ids = result.boxes.cls  # Get class IDs

    # Iterate over each box
    for i, box in enumerate(boxes):
        x1, y1, x2, y2 = map(int, box)  # Convert to integers
        confidence = confidences[i]
        class_id = int(class_ids[i])
        class_name = result.names[class_id]  # Get class name from ID

        # Crop the image based on bounding box coordinates
        cropped_image = image[y1:y2, x1:x2]

        # Generate a filename with the class name and index
        cropped_filename = f"{class_name}_{i}.jpg"

        # Save the cropped image
        cv2.imwrite(os.path.join(output_dir, cropped_filename), cropped_image)

        # Optionally, save the label (class name and confidence) in a text file
        with open(os.path.join(output_dir, f"{class_name}_{i}.txt"), "w") as f:
            f.write(f"Class: {class_name}\n")
            f.write(f"Confidence: {confidence:.2f}\n")
