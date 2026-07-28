import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().positive().default(3000),

  DATABASE_URL: z.string().startsWith('postgresql://'),

  JWT_SECRET: z.string().min(32, 'Must be atleast 32 chars long'),

  JWT_EXPIRES_IN: z.string().default('7d'),

  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
})

export type Env = z.infer<typeof envSchema>
let env: Env;

try {
  env = envSchema.parse(process.env)
} catch (e) {
  if (e instanceof z.ZodError) {
    console.log('Invalid env var')
    console.error(JSON.stringify(e.flatten().fieldErrors, null, 2))

    e.issues.forEach((err) => {
      const path = err.path.join('.')
      console.log(`${path}: ${err.message}`)
    })

    process.exit(1)
  }

  throw e
}

export { env }
export default env
