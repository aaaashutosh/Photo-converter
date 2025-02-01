const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const preview = document.getElementById('preview');
const errorMessage = document.getElementById('error-message');
const downloadButton = document.getElementById('download-btn');

let resizedImage; // To store the resized image blob for download

// Trigger file input when drop area is clicked
dropArea.addEventListener('click', () => {
    fileInput.click();
});

// Handle drag-and-drop events
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('dragover');
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
});

// Handle file input change
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    handleFileUpload(file);
});

function handleFileUpload(file) {
    errorMessage.textContent = ''; // Clear previous errors
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        errorMessage.textContent = 'Please upload a valid image file.';
        return;
    }

    // Use FileReader to load the image
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // Resize the image while keeping aspect ratio
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const targetWidth = 1200;
            const targetHeight = 720;

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // Fill the canvas with a white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Calculate aspect ratio and center the image
            const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
            const width = img.width * scale;
            const height = img.height * scale;
            const x = (targetWidth - width) / 2;
            const y = (targetHeight - height) / 2;

            // Draw the image onto the canvas
            ctx.drawImage(img, x, y, width, height);

            // Convert canvas to a Blob and create a download link
            canvas.toBlob((blob) => {
                resizedImage = blob; // Store resized image blob
                const url = URL.createObjectURL(blob);
                imagePreview.src = url; // Display resized image in preview
                preview.style.display = 'block'; // Show the preview section
                downloadButton.style.display = 'inline-block'; // Show the download button
            }, 'image/jpeg');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Download the resized image when the button is clicked
downloadButton.addEventListener('click', () => {
    if (resizedImage) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(resizedImage);
        link.download = 'resized-image.jpg'; // Set the download file name
        link.click(); // Trigger the download
    }
});