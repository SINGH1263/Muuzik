import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // create the instance

export default prisma; // ✅ export the instance (default)
