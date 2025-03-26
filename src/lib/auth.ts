import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/utils/password";
import { useGoogleAuth } from "@/config/auth";

// Extend the session type to include user ID
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  
  interface User {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  }
}

// Build the providers array based on configuration
const buildProviders = () => {
  const providers = [];
  
  // Always include Credentials provider for email/password
  providers.push(
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hello@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .then(rows => rows[0]);

          if (!user || !user.passwordHash || !user.salt) {
            return null;
          }

          const isValidPassword = verifyPassword(
            credentials.password,
            user.passwordHash,
            user.salt
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.picture,
          };
        } catch (error) {
          console.error("Error in credentials authorization:", error);
          return null;
        }
      }
    })
  );
  
  // Conditionally include Google provider based on configuration
  if (useGoogleAuth) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      })
    );
  }
  
  return providers;
};

export const authOptions: NextAuthOptions = {
  providers: buildProviders(),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async signIn({ user, account }) {
      if (!user.email) return false;
      
      try {
        // Check if user exists in database
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .then(rows => rows[0]);
        
        if (!existingUser) {
          // Create new user in database
          await db.insert(users).values({
            id: user.id,
            email: user.email,
            name: user.name || null,
            picture: user.image || null,
            authType: account?.provider || 'credentials',
          });
        } else {
          // Update user information
          await db
            .update(users)
            .set({
              name: user.name || null,
              picture: user.image || null,
              updatedAt: new Date(),
            })
            .where(eq(users.id, existingUser.id));
        }
        
        return true;
      } catch (error) {
        console.error("Error saving user to database:", error);
        // Allow sign in even if database operations fail
        return true;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  // Add trusted host configuration for Vercel
  // trustHost: true,
};
