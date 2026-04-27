import express from 'express';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sisters Lab API',
      version: '1.0.0',
      description: 'API E-commerce Sisters Lab',
      contact: {
        name: 'API Support',
        email: 'support@sisterslab.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            brand: { type: 'string' },
            category: { type: 'string' },
            basePrice: { type: 'number' },
            description: { type: 'string' },
            originalPrice: { type: 'number', nullable: true },
            badge: { type: 'string', nullable: true },
            featured: { type: 'boolean' },
            inStock: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'brand', 'category', 'basePrice', 'attributes'],
          properties: {
            name: { type: 'string', minLength: 3 },
            brand: { type: 'string', minLength: 2 },
            category: { type: 'string' },
            basePrice: { type: 'number', minimum: 0 },
            description: { type: 'string' },
            originalPrice: { type: 'number' },
            badge: { type: 'string' },
            featured: { type: 'boolean' },
            attributes: {
              type: 'object',
              properties: {
                colors: { type: 'array', items: { type: 'string' } },
                sizes: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        InternalError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    paths: {
      '/products': {
        get: {
          summary: 'List all products',
          tags: ['Products'],
          responses: {
            '200': {
              description: 'List of products',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create a new product',
          tags: ['Products'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductInput' }
              }
            }
          },
          responses: {
            '201': {
              description: 'Product created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Product' }
                }
              }
            },
            '400': { $ref: '#/components/responses/BadRequest' }
          }
        }
      },
      '/products/{sku}': {
        get: {
          summary: 'Get product by SKU',
          tags: ['Products'],
          parameters: [
            {
              name: 'sku',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Product SKU'
            }
          ],
          responses: {
            '200': {
              description: 'Product found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Product' }
                }
              }
            },
            '404': { $ref: '#/components/responses/NotFound' }
          }
        }
      }
    }
  },
  apis: ['./src/adapters/http/routes/*.ts']
};

export function setupSwagger(app: express.Express) {
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');

  const specs = swaggerJsdoc(swaggerOptions);

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true
    }
  }));

  app.get('/api-docs.json', (req: express.Request, res: express.Response) => {
    res.json(specs);
  });
}