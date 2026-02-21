import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  try {
    await prisma.$connect()
    console.log("Connected successfully!")
  } catch(e) {
    console.error("Connection failed:")
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
