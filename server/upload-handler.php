<?php
/**
 * AniWalls Upload Handler (PHP)
 * For shared hosting without Node.js
 * 
 * Place this file on your web server:
 * https://your-domain.com/upload-handler.php
 * 
 * Configuration:
 * - Max file size: 50MB
 * - Allowed types: JPEG, PNG, WebP, GIF
 * - Upload directory: ./uploads/
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuration
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

// Ensure upload directory exists
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// Make it writable
if (!is_writable(UPLOAD_DIR)) {
    chmod(UPLOAD_DIR, 0755);
}

// Route handler
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

try {
    // Health check
    if ($path === '/upload-handler.php' && $method === 'GET') {
        if (isset($_GET['health'])) {
            echo json_encode(['status' => 'ok', 'timestamp' => date('c')]);
            exit;
        }
    }

    // Upload endpoint
    if ($path === '/upload-handler.php' && $method === 'POST') {
        if (isset($_FILES['wallpaper'])) {
            handleFileUpload($_FILES['wallpaper']);
        } elseif (isset($_POST['image'])) {
            handleBase64Upload($_POST['image']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'No file or image data provided']);
        }
        exit;
    }

    // List wallpapers
    if ($path === '/upload-handler.php' && $method === 'GET' && isset($_GET['list'])) {
        listWallpapers();
        exit;
    }

    // Delete wallpaper
    if ($path === '/upload-handler.php' && $method === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (isset($input['filename'])) {
            deleteWallpaper($input['filename']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'No filename provided']);
        }
        exit;
    }

    // Default response
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

// ============ Functions ============

function handleFileUpload($file) {
    // Validate file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Upload failed: ' . getUploadErrorMessage($file['error']));
    }

    if ($file['size'] > MAX_FILE_SIZE) {
        throw new Exception('File too large. Maximum: 50MB');
    }

    if (!in_array($file['type'], ALLOWED_TYPES)) {
        throw new Exception('Invalid file type. Only images allowed');
    }

    // Generate unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'wallpaper-' . time() . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
    $filepath = UPLOAD_DIR . $filename;

    // Move file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        throw new Exception('Failed to save file');
    }

    // Return response
    echo json_encode([
        'success' => true,
        'url' => '/uploads/' . $filename,
        'filename' => $filename,
        'size' => $file['size'],
        'timestamp' => date('c')
    ]);
}

function handleBase64Upload($imageData) {
    // Remove data URL prefix if present
    $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $imageData);

    // Decode
    $binaryData = base64_decode($imageData, true);
    if ($binaryData === false) {
        throw new Exception('Invalid base64 data');
    }

    // Check size
    if (strlen($binaryData) > MAX_FILE_SIZE) {
        throw new Exception('Image too large');
    }

    // Generate filename
    $filename = 'wallpaper-' . time() . '.jpg';
    $filepath = UPLOAD_DIR . $filename;

    // Write file
    if (file_put_contents($filepath, $binaryData) === false) {
        throw new Exception('Failed to save image');
    }

    echo json_encode([
        'success' => true,
        'url' => '/uploads/' . $filename,
        'filename' => $filename,
        'timestamp' => date('c')
    ]);
}

function listWallpapers() {
    $files = glob(UPLOAD_DIR . '*');
    $wallpapers = [];

    foreach ($files as $file) {
        if (is_file($file)) {
            $wallpapers[] = [
                'filename' => basename($file),
                'url' => '/uploads/' . basename($file),
                'size' => filesize($file),
                'uploaded' => date('c', filemtime($file))
            ];
        }
    }

    echo json_encode([
        'wallpapers' => $wallpapers,
        'count' => count($wallpapers)
    ]);
}

function deleteWallpaper($filename) {
    // Security: prevent directory traversal
    if (strpos($filename, '..') !== false || strpos($filename, '/') !== false) {
        throw new Exception('Invalid filename');
    }

    $filepath = UPLOAD_DIR . $filename;

    // Check file exists and is in upload directory
    if (!file_exists($filepath) || !is_file($filepath)) {
        throw new Exception('File not found');
    }

    if (strpos(realpath($filepath), realpath(UPLOAD_DIR)) !== 0) {
        throw new Exception('Invalid file location');
    }

    if (!unlink($filepath)) {
        throw new Exception('Failed to delete file');
    }

    echo json_encode([
        'success' => true,
        'message' => 'Wallpaper deleted'
    ]);
}

function getUploadErrorMessage($errorCode) {
    $messages = [
        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds form MAX_FILE_SIZE',
        UPLOAD_ERR_PARTIAL => 'File partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'No temporary directory',
        UPLOAD_ERR_CANT_WRITE => 'Cannot write file',
        UPLOAD_ERR_EXTENSION => 'PHP extension error'
    ];
    return $messages[$errorCode] ?? 'Unknown error';
}
?>
