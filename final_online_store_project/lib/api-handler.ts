import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { authenticateRequest, createErrorResponse, createSuccessResponse } from './auth-middleware'
import { validateObjectId, validateRequiredFields } from './validation'
import connectDB from './mongoose'

export interface ApiHandlerOptions {
  requireAuth?: boolean
  requireAdmin?: boolean
  validateId?: boolean
  model?: any
  populateFields?: string | string[]
}

export interface ApiHandlerContext {
  req: Request
  params?: { id?: string }
  userId?: string
  isAdmin?: boolean
}

export type ApiHandler = (context: ApiHandlerContext) => Promise<NextResponse>

export function createApiHandler(handler: ApiHandler, options: ApiHandlerOptions = {}) {
  return async (req: Request, routeParams?: { params: Promise<{ id: string }> }) => {
    try {
      await connectDB()

      const context: ApiHandlerContext = { req }

      // Handle params if provided
      if (routeParams?.params) {
        const resolvedParams = await routeParams.params
        context.params = resolvedParams

        // Validate ID if required
        if (options.validateId && resolvedParams.id) {
          const validation = validateObjectId(resolvedParams.id)
          if (!validation.valid) {
            return validation.error!
          }
        }
      }

      // Handle authentication if required
      if (options.requireAuth) {
        const authResult = await authenticateRequest(req)
        if (!authResult.success) {
          return authResult.error!
        }
        context.userId = authResult.userId
        
        // Check if user is admin when required
        if (options.requireAdmin) {
          // Check if user is admin
          const User = (await import('@/models/User')).default
          const user = await User.findById(authResult.userId)
          if (!user || !user.admin) {
            return createErrorResponse('Acesso negado. Privilégios de administrador necessários.', 403)
          }
          context.isAdmin = true
        }
      }

      return await handler(context)
    } catch (error) {
      console.error('API Handler Error:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  }
}

// Generic CRUD operations
export class CrudHandler {
  constructor(private model: any, private entityName: string) {}

  getAll = createApiHandler(async ({ req }) => {
    const entities = await this.model.find({}).sort({ createdAt: -1 })
    return NextResponse.json(entities)
  })

  getById = createApiHandler(async ({ params }) => {
    const entity = await this.model.findById(params!.id)
    if (!entity) {
      return createErrorResponse(`${this.entityName} não encontrado`, 404)
    }
    return NextResponse.json(entity)
  }, { validateId: true })

  create = createApiHandler(async ({ req }) => {
    const data = await req.json()
    const entity = await this.model.create(data)
    return createSuccessResponse({ [this.entityName.toLowerCase()]: entity }, `${this.entityName} criado com sucesso`, 201)
  })

  update = createApiHandler(async ({ req, params }) => {
    const data = await req.json()
    const entity = await this.model.findByIdAndUpdate(
      params!.id,
      data,
      { new: true, runValidators: true }
    )
    if (!entity) {
      return createErrorResponse(`${this.entityName} não encontrado`, 404)
    }
    return createSuccessResponse({ [this.entityName.toLowerCase()]: entity }, `${this.entityName} atualizado com sucesso`)
  }, { validateId: true })

  delete = createApiHandler(async ({ params }) => {
    const entity = await this.model.findByIdAndDelete(params!.id)
    if (!entity) {
      return createErrorResponse(`${this.entityName} não encontrado`, 404)
    }
    return createSuccessResponse(undefined, `${this.entityName} excluído com sucesso`)
  }, { validateId: true })
}

// User-specific operations
export class UserCrudHandler extends CrudHandler {
  getUserResource = (resourceModel: any, resourceName: string, populateFields?: string) => 
    createApiHandler(async ({ req, userId }) => {
      const query = resourceModel.find({ user: userId })
      if (populateFields) {
        query.populate(populateFields)
      }
      const resources = await query.sort({ createdAt: -1 })
      return NextResponse.json(resources || [])
    }, { requireAuth: true })

  createUserResource = (resourceModel: any, resourceName: string) =>
    createApiHandler(async ({ req, userId }) => {
      const data = await req.json()
      const resource = await resourceModel.create({ ...data, user: userId })
      return createSuccessResponse(
        { [resourceName]: resource },
        `${resourceName} criado com sucesso`,
        201
      )
    }, { requireAuth: true })

  updateUserResource = (resourceModel: any, resourceName: string) =>
    createApiHandler(async ({ req, params, userId }) => {
      const data = await req.json()
      const resource = await resourceModel.findOneAndUpdate(
        { _id: params!.id, user: userId },
        data,
        { new: true, runValidators: true }
      )
      if (!resource) {
        return createErrorResponse(`${resourceName} não encontrado`, 404)
      }
      return createSuccessResponse({ [resourceName]: resource }, `${resourceName} atualizado com sucesso`)
    }, { requireAuth: true, validateId: true })

  deleteUserResource = (resourceModel: any, resourceName: string) =>
    createApiHandler(async ({ params, userId }) => {
      const resource = await resourceModel.findOneAndDelete({
        _id: params!.id,
        user: userId
      })
      if (!resource) {
        return createErrorResponse(`${resourceName} não encontrado`, 404)
      }
      return createSuccessResponse(undefined, `${resourceName} excluído com sucesso`)
    }, { requireAuth: true, validateId: true })
}

// Export individual helper functions
export { createErrorResponse, createSuccessResponse } from './auth-middleware'
