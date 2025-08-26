import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type TransformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0]

type SchemaBody = {
  type: string
  required: string[]
  properties: Record<string, unknown>
}

export function transformSwaggerSchema(data: TransformSwaggerSchemaData) {
  const { schema, url } = jsonSchemaTransform(data)

  const isMultipart = schema.consumes?.includes('multipart/form-data')
  if (isMultipart) {
    const body = (schema.body ?? {
      type: 'object',
      required: [] as string[],
      properties: {} as Record<string, unknown>,
    }) as SchemaBody

    body.properties.file = {
      type: 'string',
      format: 'binary',
    }

    if (!body.required.includes('file')) {
      body.required.push('file')
    }

    schema.body = body
  }

  return { schema, url }
}
