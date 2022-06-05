import Redis from 'ioredis'
import RedisConfig from '../config/redis.config'

// Persistent key-value store is provided by Redis, hosted on Upstash
// https://vercel.com/integrations/upstash
const kv = new Redis(RedisConfig.redisUrl)

export async function getOdAuthTokens(): Promise<{ accessToken: unknown; refreshToken: unknown }> {
  const accessToken = await kv.get(RedisConfig.keyPrefix + 'access_token')
  const refreshToken = await kv.get(RedisConfig.keyPrefix + 'refresh_token')

  return {
    accessToken,
    refreshToken,
  }
}

export async function storeOdAuthTokens({
  accessToken,
  accessTokenExpiry,
  refreshToken,
}: {
  accessToken: string
  accessTokenExpiry: number
  refreshToken: string
}): Promise<void> {
  await kv.set(RedisConfig.keyPrefix + 'access_token', accessToken, 'ex', accessTokenExpiry)
  await kv.set(RedisConfig.keyPrefix + 'refresh_token', refreshToken)
}
