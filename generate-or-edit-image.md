# Generate or Edit Image

> Submit Nanobanana image generation or editing task using the NanoBanana AI model.

### Usage Modes

1. **Text-to-Image Generation**
   * Provide `prompt` and set `type` to "TEXTTOIAMGE"
   * Model will generate a new image based on the text description

2. **Image-to-Image Editing**
   * Provide `prompt`, `imageUrls` and set `type` to "IMAGETOIAMGE"
   * Model will edit the input images according to the prompt

### Important Notes

* You can generate 1-4 images per request using the `numImages` parameter
* Use the `image_size` parameter to specify the desired aspect ratio for your images
* Callback URL (`callBackUrl`) is required for receiving task completion notifications
* Task completion will be sent to your callback URL via POST request
* Use the Get Task Details endpoint to poll task status if needed
* Choose the appropriate generation type based on your needs:
  * TEXTTOIAMGE: Text to Image generation
  * IMAGETOIAMGE: Image editing with input images


## OpenAPI

````yaml nanobanana-api/nanobanana-api.json post /api/v1/nanobanana/generate
openapi: 3.0.0
info:
  title: NanoBanana API
  description: NanoBanana API Documentation - Image Generation and Editing API
  version: 1.0.0
  contact:
    name: Technical Support
    email: support@nanobananaapi.ai
servers:
  - url: https://api.nanobananaapi.ai
    description: API Server
security:
  - BearerAuth: []
paths:
  /api/v1/nanobanana/generate:
    post:
      summary: Generate or Edit Image
      description: |-
        Submit Nanobanana image generation or editing task.

        ### Usage Modes
        1. **Text-to-Image Generation** (TEXTTOIAMGE)
           - Provide `prompt` and set `type` to "TEXTTOIAMGE"
           - Model will generate a new image based on the text description

        2. **Image-to-Image Editing** (IMAGETOIAMGE)
           - Provide `prompt`, `imageUrls` and set `type` to "IMAGETOIAMGE"
           - Model will edit the input images according to the prompt

        ### Important Notes
        - You can generate 1-4 images per request
        - Callback URL is required for task completion notifications
      operationId: generate-or-edit-image
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                prompt:
                  type: string
                  description: Text prompt describing the desired image or edit.
                  example: >-
                    A serene mountain landscape at sunset with a lake reflecting
                    the orange sky
                numImages:
                  type: integer
                  minimum: 1
                  maximum: 4
                  description: 'Number of images to generate. Min: 1, Max: 4'
                  default: 1
                  example: 1
                imageUrls:
                  type: array
                  items:
                    type: string
                    format: uri
                  description: Array of input image URLs for image editing mode
                  example:
                    - https://example.com/input-image.jpg
                type:
                  type: string
                  enum:
                    - IMAGETOIAMGE
                    - TEXTTOIAMGE
                  description: |-
                    Generation type:
                    - TEXTTOIAMGE: Text to Image
                    - IMAGETOIAMGE: Image Editing
                  example: TEXTTOIAMGE
                watermark:
                  type: string
                  description: Watermark text to add to generated images
                  example: NanoBanana
                image_size:
                  type: string
                  enum:
                    - '1:1'
                    - '9:16'
                    - '16:9'
                    - '3:4'
                    - '4:3'
                    - '3:2'
                    - '2:3'
                    - '5:4'
                    - '4:5'
                    - '21:9'
                  description: |-
                    Image aspect ratio. Supported ratios:
                    - 1:1: Square
                    - 9:16: Portrait (mobile)
                    - 16:9: Landscape (widescreen)
                    - 3:4: Portrait
                    - 4:3: Landscape (traditional)
                    - 3:2: Landscape (photo)
                    - 2:3: Portrait (photo)
                    - 5:4: Portrait (close to square)
                    - 4:5: Portrait (close to square)
                    - 21:9: Ultra-wide landscape
                  example: '1:1'
                callBackUrl:
                  type: string
                  format: uri
                  description: >-
                    Callback URL to receive task completion notifications
                    (required)
                  example: https://your-callback-url.com/callback
              required:
                - prompt
                - type
                - callBackUrl
              example:
                prompt: >-
                  A serene mountain landscape at sunset with a lake reflecting
                  the orange sky
                numImages: 1
                type: TEXTTOIAMGE
                image_size: '16:9'
                callBackUrl: https://your-callback-url.com/callback
      responses:
        '200':
          description: Request successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    enum:
                      - 200
                      - 400
                      - 401
                      - 500
                    description: |-
                      Response status code

                      - **200**: Success
                      - **400**: Parameter error
                      - **401**: Unauthorized
                      - **500**: Server internal error
                  msg:
                    type: string
                    description: Response message
                    example: success
                  data:
                    type: object
                    properties:
                      taskId:
                        type: string
                        description: Task ID for tracking the generation progress
                        example: task12345
              example:
                code: 200
                msg: success
                data:
                  taskId: task12345
        '400':
          description: Parameter error
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    example: 400
                  msg:
                    type: string
                    example: Parameter error
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    example: 401
                  msg:
                    type: string
                    example: Unauthorized
        '500':
          description: Server internal error
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    example: 500
                  msg:
                    type: string
                    example: Server internal error
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: API Key
      description: >-
        All APIs require authentication via Bearer Token.


        Get API Key:

        1. Visit [API Key Management Page](https://nanobananaapi.ai/api-key) to
        get your API Key


        Usage:

        Add to request header:

        Authorization: Bearer YOUR_API_KEY


        Note:

        - Keep your API Key secure and do not share it with others

        - If you suspect your API Key has been compromised, reset it immediately
        in the management page

````

---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.nanobananaapi.ai/llms.txt