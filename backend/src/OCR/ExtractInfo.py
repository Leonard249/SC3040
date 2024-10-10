import base64

from ultralytics import YOLO
import cv2
import os
import glob


class OCRModel:
    def __init__(self):
        model_path = os.path.join(os.path.dirname(__file__), 'Receipt.pt')  # Dynamic path for the model
        self.model = YOLO(model_path)
        base_dir = os.path.dirname(__file__)  # Get the directory where the script is located
        self.input_dir = os.path.join(base_dir, 'Input')  # Dynamic path for the input directory
        self.output_dir = os.path.join(base_dir, 'cropped_images')  # Dynamic path for the output directory

    def save_base64_image(self, encoded_image, filename='input_image.png'):
        """Decode a base64 image and save it as a PNG file in the input directory."""
        # Create input directory if it doesn't exist
        os.makedirs(self.input_dir, exist_ok=True)

        # Decode base64 to binary data
        image_data = base64.b64decode(encoded_image)

        # Define the file path for the image to be saved
        file_path = os.path.join(self.input_dir, filename)

        # Write binary data to the file
        with open(file_path, 'wb') as f:
            f.write(image_data)
        print(f"Image saved to {file_path}")

    def initialiseModel(self, encodedImage):

        self.save_base64_image(encodedImage)

        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)

        # Get a list of all image files in the input directory
        image_files = glob.glob(os.path.join(self.input_dir, '*.*'))  # Adjust the pattern if needed

        # Iterate over each image file in the input directory
        for image_path in image_files:
            print(f"Processing {image_path}...")

            # Run prediction
            results = self.model.predict(image_path)
            image = cv2.imread(image_path)

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
                    cropped_filename = f"{class_name}.jpg"

                    # Save the cropped image
                    cv2.imwrite(os.path.join(self.output_dir, cropped_filename), cropped_image)

                    # Optionally, save the label (class name and confidence) in a text file
                    with open(os.path.join(self.output_dir, f"{class_name}.txt"), "w") as f:
                        f.write(f"Class: {class_name}\n")
                        f.write(f"Confidence: {confidence:.2f}\n")

            # Clear the input file after processing
            os.remove(image_path)
            print(f"Cleared {image_path} from the input folder.")

        print("Processing complete. All images have been processed and cleared from the input folder.")
