import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import crypto from "crypto"

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(clientId: string): boolean {
  const now = Date.now()
  const limit = rateLimitStore.get(clientId)

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + 60000 }) // 1 minute window
    return true
  }

  if (limit.count >= 10) {
    // 10 requests per minute
    return false
  }

  limit.count++
  return true
}

// Authentication endpoint for API access
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { client_id, client_secret, grant_type, scope } = body

    // Rate limiting
    if (!checkRateLimit(client_id)) {
      return NextResponse.json(
        {
          error: "rate_limit_exceeded",
          error_description: "Too many authentication requests",
        },
        { status: 429 },
      )
    }

    // Validate grant type
    if (grant_type !== "client_credentials") {
      return NextResponse.json(
        {
          error: "unsupported_grant_type",
          error_description: "Only client_credentials grant type is supported",
        },
        { status: 400 },
      )
    }

    // Validate required fields
    if (!client_id || !client_secret) {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description: "client_id and client_secret are required",
        },
        { status: 400 },
      )
    }

    // Valid client configurations
    const validClients = {
      netflix_integration: {
        secret: process.env.NETFLIX_CLIENT_SECRET,
        scopes: ["billing:read", "billing:write", "subscriptions:manage", "analytics:read", "webhooks:receive"],
        name: "Netflix Integration",
      },
      disney_integration: {
        secret: process.env.DISNEY_CLIENT_SECRET,
        scopes: ["billing:read", "billing:write", "subscriptions:manage", "analytics:read"],
        name: "Disney+ Integration",
      },
      hulu_integration: {
        secret: process.env.HULU_CLIENT_SECRET,
        scopes: ["billing:read", "subscriptions:manage", "analytics:read"],
        name: "Hulu Integration",
      },
      prime_integration: {
        secret: process.env.PRIME_CLIENT_SECRET,
        scopes: ["billing:read", "billing:write", "subscriptions:manage", "analytics:read", "fraud:detect"],
        name: "Prime Video Integration",
      },
      roku_integration: {
        secret: process.env.ROKU_CLIENT_SECRET,
        scopes: ["billing:read", "subscriptions:manage"],
        name: "Roku Integration",
      },
      apple_integration: {
        secret: process.env.APPLE_CLIENT_SECRET,
        scopes: ["billing:read", "billing:write", "subscriptions:manage", "analytics:read"],
        name: "Apple TV+ Integration",
      },
    }

    const client = validClients[client_id as keyof typeof validClients]

    if (!client || !client.secret || client.secret !== client_secret) {
      return NextResponse.json(
        {
          error: "invalid_client",
          error_description: "Invalid client credentials",
        },
        { status: 401 },
      )
    }

    // Validate requested scopes
    const requestedScopes = scope ? scope.split(" ") : client.scopes
    const invalidScopes = requestedScopes.filter((s) => !client.scopes.includes(s))

    if (invalidScopes.length > 0) {
      return NextResponse.json(
        {
          error: "invalid_scope",
          error_description: `Invalid scopes: ${invalidScopes.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Generate JWT token
    const tokenPayload = {
      client_id,
      client_name: client.name,
      scope: requestedScopes.join(" "),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      jti: crypto.randomUUID(), // Unique token ID
      iss: "gobill-ai",
      aud: "ott-platforms",
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "default-secret", { algorithm: "HS256" })

    // Generate refresh token for long-lived access
    const refreshTokenPayload = {
      client_id,
      token_type: "refresh",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
      jti: crypto.randomUUID(),
    }

    const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_REFRESH_SECRET || "default-refresh-secret", {
      algorithm: "HS256",
    })

    // Log successful authentication
    console.log(`Successful authentication for client: ${client.name}`, {
      client_id,
      scopes: requestedScopes,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      access_token: token,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: 86400, // 24 hours
      scope: requestedScopes.join(" "),
      client_name: client.name,
      issued_at: Math.floor(Date.now() / 1000),
    })
  } catch (error) {
    console.error("Auth API error:", error)
    return NextResponse.json(
      {
        error: "server_error",
        error_description: "Authentication service temporarily unavailable",
      },
      { status: 500 },
    )
  }
}

// Token refresh endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { refresh_token, grant_type } = body

    if (grant_type !== "refresh_token") {
      return NextResponse.json(
        {
          error: "unsupported_grant_type",
          error_description: "Only refresh_token grant type is supported for this endpoint",
        },
        { status: 400 },
      )
    }

    if (!refresh_token) {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description: "refresh_token is required",
        },
        { status: 400 },
      )
    }

    // Verify refresh token
    let refreshPayload
    try {
      refreshPayload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET || "default-refresh-secret") as any
    } catch (error) {
      return NextResponse.json(
        {
          error: "invalid_grant",
          error_description: "Invalid or expired refresh token",
        },
        { status: 401 },
      )
    }

    if (refreshPayload.token_type !== "refresh") {
      return NextResponse.json(
        {
          error: "invalid_grant",
          error_description: "Invalid token type",
        },
        { status: 401 },
      )
    }

    // Get client configuration
    const validClients = {
      netflix_integration: {
        scopes: ["billing:read", "billing:write", "subscriptions:manage", "analytics:read", "webhooks:receive"],
        name: "Netflix Integration",
      },
      disney_integration: {
        scopes: ["billing:read", "billing:write", "subscriptions:manage", "analytics:read"],
        name: "Disney+ Integration",
      },
      hulu_integration: {
        scopes: ["billing:read", "subscriptions:manage", "analytics:read"],
        name: "Hulu Integration",
      },
      prime_integration: {
        scopes: ["billing:read", "billing:write", "subscriptions:manage", "analytics:read", "fraud:detect"],
        name: "Prime Video Integration",
      },
    }

    const client = validClients[refreshPayload.client_id as keyof typeof validClients]
    if (!client) {
      return NextResponse.json(
        {
          error: "invalid_client",
          error_description: "Client not found",
        },
        { status: 401 },
      )
    }

    // Generate new access token
    const newTokenPayload = {
      client_id: refreshPayload.client_id,
      client_name: client.name,
      scope: client.scopes.join(" "),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      jti: crypto.randomUUID(),
      iss: "gobill-ai",
      aud: "ott-platforms",
    }

    const newToken = jwt.sign(newTokenPayload, process.env.JWT_SECRET || "default-secret", { algorithm: "HS256" })

    return NextResponse.json({
      access_token: newToken,
      token_type: "Bearer",
      expires_in: 86400,
      scope: client.scopes.join(" "),
      issued_at: Math.floor(Date.now() / 1000),
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json(
      {
        error: "server_error",
        error_description: "Token refresh service temporarily unavailable",
      },
      { status: 500 },
    )
  }
}
