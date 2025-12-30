import { Injectable } from '@nestjs/common';
import { db, users, User, NewUser } from '@database';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
    async findAll(): Promise<User[]> {
        return db.select().from(users);
    }

    async findOne(id: number): Promise<User | undefined> {
        const result = await db.select().from(users).where(eq(users.id, id));
        return result[0];
    }

    async create(data: NewUser): Promise<User> {
        const result = await db.insert(users).values(data).returning();
        return result[0];
    }

    async update(id: number, data: Partial<NewUser>): Promise<User | undefined> {
        const result = await db
            .update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(users.id, id))
            .returning();
        return result[0];
    }

    async delete(id: number): Promise<boolean> {
        const result = await db.delete(users).where(eq(users.id, id)).returning();
        return result.length > 0;
    }
}
