# Get Task Details

> Query NanoBanana task execution details and status.

<Info>
  Query the status and results of a NanoBanana image generation or editing task.
</Info>

### Status Descriptions

* **0: GENERATING** - Task is currently being processed
* **1: SUCCESS** - Task completed successfully
* **2: CREATE\_TASK\_FAILED** - Failed to create the task
* **3: GENERATE\_FAILED** - Task creation succeeded but generation failed

### Usage Guide

* Use this endpoint to check the current status of your generation task
* Monitor task progress using the `successFlag` field
* Retrieve generated image URLs when task is completed successfully
* Handle error cases using `errorCode` and `errorMessage` fields

### Developer Notes

* Task ID is obtained from the Generate or Edit Image endpoint response
* Generated images URLs are available when `successFlag` is 1 (SUCCESS)
* Original image URL (`originImageUrl`) from BFL is valid for 10 minutes only
* Result image URL (`resultImageUrl`) on our server has longer availability


## OpenAPI

````yaml nanobanana-api/nanobanana-api.json get /api/v1/nanobanana/record-info
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
  /api/v1/nanobanana/record-info:
    get:
      summary: Get Task Details
      description: |-
        Query NanoBanana task execution details and status.

        ### Status Descriptions
        - 0: GENERATING - Task is currently being processed
        - 1: SUCCESS - Task completed successfully
        - 2: CREATE_TASK_FAILED - Failed to create the task
        - 3: GENERATE_FAILED - Task creation succeeded but generation failed
      operationId: get-task-details
      parameters:
        - in: query
          name: taskId
          description: Task ID (required)
          required: true
          schema:
            type: string
          example: nanobanana_123456
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
                      - 404
                      - 500
                    description: |-
                      Response status code

                      - **200**: Success
                      - **400**: Parameter error
                      - **401**: Unauthorized
                      - **404**: Task not found
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
                        description: Task ID
                        example: nanobanana_task_123456
                      paramJson:
                        type: string
                        description: Request parameters in JSON format
                        example: ''
                      completeTime:
                        type: string
                        description: Task completion time
                        example: ''
                      response:
                        type: object
                        description: Generation result
                        properties:
                          originImageUrl:
                            type: string
                            description: BFL original image URL (valid for 10 minutes)
                            example: https://bfl.com/image/original.jpg
                          resultImageUrl:
                            type: string
                            description: Our server's image URL
                            example: https://ourserver.com/image/result.jpg
                      successFlag:
                        type: integer
                        description: >-
                          Generation status: 0-generating, 1-success, 2-create
                          task failed, 3-generation failed
                        enum:
                          - 0
                          - 1
                          - 2
                          - 3
                        example: 1
                      errorCode:
                        type: integer
                        description: Error code
                        example: 0
                      errorMessage:
                        type: string
                        description: Error message
                        example: ''
                      createTime:
                        type: string
                        description: Task creation time
                        example: ''
              example:
                code: 200
                msg: success
                data:
                  taskId: nanobanana_task_123456
                  paramJson: ''
                  completeTime: ''
                  response:
                    originImageUrl: https://bfl.com/image/original.jpg
                    resultImageUrl: https://ourserver.com/image/result.jpg
                  successFlag: 1
                  errorCode: 0
                  errorMessage: ''
                  createTime: ''
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
        '404':
          description: Task not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    example: 404
                  msg:
                    type: string
                    example: Task not found
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