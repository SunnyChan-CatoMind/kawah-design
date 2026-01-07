# Image Generation or Editing Callbacks

> When image generation tasks are completed, the system will send results to your provided callback URL via POST request

When you submit image generation or editing tasks to the NanoBanana API, you can set a callback address through the `callBackUrl` parameter. After the task is completed, the system will automatically push the results to your specified address.

## Callback Mechanism Overview

<Info>
  The callback mechanism eliminates the need for you to poll the API to query task status. The system will actively push task completion results to your server.
</Info>

### Callback Timing

The system will send callback notifications in the following situations:

* Image generation or editing task completed successfully
* Image generation or editing task failed
* Error occurred during task processing

### Callback Method

* **HTTP Method**: POST
* **Content Type**: application/json
* **Timeout Setting**: 15 seconds

## Callback Request Format

After task completion, the system will send a POST request to your `callBackUrl` in the following format:

<CodeGroup>
  ```json Success Callback theme={null}
  {
    "msg": "Image generated successfully.",
    "code": 200,
    "data": {
      "taskId": "9e4286b7b27960dfeb8e1d279b50b28d",
      "info": {
        "resultImageUrl": "https://tempfile.aiquickdraw.com/r/9e4286b7b27960dfeb8e1d279b50b28d_1756467493.jpg"
      }
    }
  }
  ```

  ```json Content Policy Violation Callback theme={null}
  {
    "code": 400,
    "msg": "Your prompt has been flagged for violating content policy",
    "data": {
      "taskId": "task12345",
      "info": {
        "resultImageUrl": ""
      }
    }
  }
  ```

  ```json Generation Failed Callback theme={null}
  {
    "code": 501,
    "msg": "Image generation task failed",
    "data": {
      "taskId": "task12345",
      "info": {
        "resultImageUrl": ""
      }
    }
  }
  ```

  ```json Internal Error Callback theme={null}
  {
    "code": 500,
    "msg": "Internal error, please try again later",
    "data": {
      "taskId": "task12345",
      "info": {
        "resultImageUrl": ""
      }
    }
  }
  ```
</CodeGroup>

## Status Code Description

<ParamField path="code" type="integer" required>
  Callback status code indicating task processing result:

  | Status Code | Description                                                   |
  | ----------- | ------------------------------------------------------------- |
  | 200         | Success - Image generation successful                         |
  | 400         | Failed - Your prompt was flagged for violating content policy |
  | 500         | Failed - Internal error, please try again later               |
  | 501         | Failed - Image generation task failed                         |
</ParamField>

<ParamField path="msg" type="string" required>
  Status message providing detailed status description
</ParamField>

<ParamField path="data.taskId" type="string" required>
  Task ID, consistent with the taskId returned when you submitted the task
</ParamField>

<ParamField path="data.info.resultImageUrl" type="string">
  Generated image URL on our server. Only exists on success.
</ParamField>

## Callback Reception Examples

Here are example codes for receiving callbacks in popular programming languages:

<Tabs>
  <Tab title="Node.js">
    ```javascript  theme={null}
    const express = require('express');
    const fs = require('fs');
    const https = require('https');
    const app = express();

    app.use(express.json());

    app.post('/nanobanana-image-callback', (req, res) => {
      const { code, msg, data } = req.body;
      
      console.log('Received NanoBanana image generation callback:', {
        taskId: data.taskId,
        status: code,
        message: msg
      });
      
      if (code === 200) {
        // Task completed successfully
        console.log('NanoBanana image generation completed successfully');
        
        const { taskId, info } = data;
        const { resultImageUrl } = info;
        
        console.log(`Generated image URL: ${resultImageUrl}`);
        
        // Download the generated image
        if (resultImageUrl) {
          downloadFile(resultImageUrl, `nanobanana_result_${taskId}.jpg`)
            .then(() => console.log('Generated image downloaded successfully'))
            .catch(err => console.error('Failed to download generated image:', err));
        }
        
      } else {
        // Task failed
        console.log('NanoBanana image generation failed:', msg);
        
        // Handle specific error types
        if (code === 400) {
          console.log('Content policy violation - please adjust your prompt');
        } else if (code === 500) {
          console.log('Internal error - please try again later');
        } else if (code === 501) {
          console.log('Generation task failed - may need to adjust parameters');
        }
      }
      
      // Return 200 status code to confirm callback receipt
      res.status(200).json({ status: 'received' });
    });

    // Helper function: download file
    function downloadFile(url, filename) {
      return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        
        https.get(url, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve();
            });
          } else {
            reject(new Error(`HTTP ${response.statusCode}`));
          }
        }).on('error', reject);
      });
    }

    app.listen(3000, () => {
      console.log('Callback server running on port 3000');
    });
    ```
  </Tab>

  <Tab title="Python">
    ```python  theme={null}
    from flask import Flask, request, jsonify
    import requests
    import os

    app = Flask(__name__)

    @app.route('/nanobanana-image-callback', methods=['POST'])
    def handle_callback():
        data = request.json
        
        code = data.get('code')
        msg = data.get('msg')
        callback_data = data.get('data', {})
        task_id = callback_data.get('taskId')
        info = callback_data.get('info', {})
        result_image_url = info.get('resultImageUrl')
        
        print(f"Received NanoBanana image generation callback:")
        print(f"Task ID: {task_id}")
        print(f"Status: {code}, Message: {msg}")
        
        if code == 200:
            # Task completed successfully
            print("NanoBanana image generation completed successfully")
            
            print(f"Generated image URL: {result_image_url}")
            
            # Download the generated image
            if result_image_url:
                try:
                    result_filename = f"nanobanana_result_{task_id}.jpg"
                    download_file(result_image_url, result_filename)
                    print(f"Generated image downloaded as {result_filename}")
                except Exception as e:
                    print(f"Failed to download generated image: {e}")
                    
        else:
            # Task failed
            print(f"NanoBanana image generation failed: {msg}")
            
            # Handle specific error types
            if code == 400:
                print("Content policy violation - please adjust your prompt")
            elif code == 500:
                print("Internal error - please try again later")
            elif code == 501:
                print("Generation task failed - may need to adjust parameters")
        
        # Return 200 status code to confirm callback receipt
        return jsonify({'status': 'received'}), 200

    def download_file(url, filename):
        """Download file from URL and save locally"""
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        os.makedirs('downloads', exist_ok=True)
        filepath = os.path.join('downloads', filename)
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

    if __name__ == '__main__':
        app.run(host='0.0.0.0', port=3000)
    ```
  </Tab>

  <Tab title="PHP">
    ```php  theme={null}
    <?php
    header('Content-Type: application/json');

    // Get POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $code = $data['code'] ?? null;
    $msg = $data['msg'] ?? '';
    $callbackData = $data['data'] ?? [];
    $taskId = $callbackData['taskId'] ?? '';
    $info = $callbackData['info'] ?? [];
    $resultImageUrl = $info['resultImageUrl'] ?? '';

    error_log("Received NanoBanana image generation callback:");
    error_log("Task ID: $taskId");
    error_log("Status: $code, Message: $msg");

    if ($code === 200) {
        // Task completed successfully
        error_log("NanoBanana image generation completed successfully");
        
        error_log("Generated image URL: $resultImageUrl");
        
        // Download the generated image
        if (!empty($resultImageUrl)) {
            try {
                $resultFilename = "nanobanana_result_{$taskId}.jpg";
                downloadFile($resultImageUrl, $resultFilename);
                error_log("Generated image downloaded as $resultFilename");
            } catch (Exception $e) {
                error_log("Failed to download generated image: " . $e->getMessage());
            }
        }
        
    } else {
        // Task failed
        error_log("NanoBanana image generation failed: $msg");
        
        // Handle specific error types
        if ($code === 400) {
            error_log("Content policy violation - please adjust your prompt");
        } elseif ($code === 500) {
            error_log("Internal error - please try again later");
        } elseif ($code === 501) {
            error_log("Generation task failed - may need to adjust parameters");
        }
    }

    // Return 200 status code to confirm callback receipt
    http_response_code(200);
    echo json_encode(['status' => 'received']);

    function downloadFile($url, $filename) {
        $downloadDir = 'downloads';
        if (!is_dir($downloadDir)) {
            mkdir($downloadDir, 0755, true);
        }
        
        $filepath = $downloadDir . '/' . $filename;
        
        $fileContent = file_get_contents($url);
        if ($fileContent === false) {
            throw new Exception("Failed to download file from URL");
        }
        
        $result = file_put_contents($filepath, $fileContent);
        if ($result === false) {
            throw new Exception("Failed to save file locally");
        }
    }
    ?>
    ```
  </Tab>
</Tabs>

## Best Practices

<Tip>
  ### Callback URL Configuration Recommendations

  1. **Use HTTPS**: Ensure callback URL uses HTTPS protocol for secure data transmission
  2. **Verify Source**: Verify the legitimacy of request sources in callback handling
  3. **Idempotent Processing**: The same taskId may receive multiple callbacks, ensure processing logic is idempotent
  4. **Quick Response**: Callback handling should return 200 status code quickly to avoid timeout
  5. **Asynchronous Processing**: Complex business logic should be processed asynchronously to avoid blocking callback response
  6. **Timely Download**: Download image files promptly after receiving successful callbacks
</Tip>

<Warning>
  ### Important Reminders

  * Callback URL must be a publicly accessible address
  * Server must respond within 15 seconds, otherwise it will be considered timeout
  * After 3 consecutive retry failures, the system will stop sending callbacks
  * Ensure stability of callback handling logic to avoid callback failures due to exceptions
  * Need to handle multiple error status codes (400, 500, 501), implement complete error handling
  * Pay attention to content policy violation issues and adjust prompts timely
</Warning>

## Troubleshooting

If you haven't received callback notifications, please check the following:

<AccordionGroup>
  <Accordion title="Network Connection Issues">
    * Confirm callback URL is accessible from the public internet
    * Check firewall settings to ensure inbound requests are not blocked
    * Verify domain name resolution is correct
  </Accordion>

  <Accordion title="Server Response Issues">
    * Ensure server returns HTTP 200 status code within 15 seconds
    * Check server logs for error information
    * Verify interface path and HTTP method are correct
  </Accordion>

  <Accordion title="Content Format Issues">
    * Confirm received POST request body is in JSON format
    * Check if Content-Type is application/json
    * Verify JSON parsing is correct
  </Accordion>

  <Accordion title="Image Processing Issues">
    * Confirm image URL is accessible
    * Check image download permissions and network connection
    * Verify image save path and permissions
    * Implement reasonable image download and storage logic
  </Accordion>

  <Accordion title="Content Policy Issues">
    * Review content policy violation prompts in error messages
    * Adjust flagged prompt content
    * Ensure prompts comply with platform content guidelines
    * Check for sensitive or inappropriate content
  </Accordion>

  <Accordion title="Task Failure Issues">
    * Check if generation parameters are reasonable
    * Verify input image format and quality
    * Confirm prompt length and format
    * Consider adjusting generation parameters and retry
  </Accordion>
</AccordionGroup>

## Alternative Solution

If you cannot use the callback mechanism, you can also use polling:

<Card title="Polling Query Results" icon="radar" href="/nanobanana-api/get-task-details">
  Use the get task details interface to periodically query task status, recommended every 30 seconds.
</Card>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.nanobananaapi.ai/llms.txt