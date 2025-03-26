import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  picture: text('picture'),
  passwordHash: text('password_hash'),  // Hashed password for email/password auth
  salt: text('salt'),               // Salt used for password hashing
  authType: text('auth_type').default('google'),  // 'google' or 'credentials'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  incorporator: text('incorporator').notNull(),
  state: text('state').notNull(),
  entityType: text('entity_type').notNull(),
  status: text('status').notNull().default('draft'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const founders = pgTable('founders', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type Founder = typeof founders.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewCompany = typeof companies.$inferInsert;
export type NewFounder = typeof founders.$inferInsert;
