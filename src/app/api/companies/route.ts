import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/db";
import { companies, founders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(_req: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await _req.json();
    const { name, incorporator, state, entityType, founders: founderNames } = body;
    
    // Validate required fields
    if (!name || !incorporator || !state || !entityType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create company record
    const companyId = crypto.randomUUID();
    await db.insert(companies).values({
      id: companyId,
      userId: session.user.id,
      name,
      incorporator,
      state,
      entityType,
      status: "draft",
    });
    
    // Create founder records
    if (Array.isArray(founderNames) && founderNames.length > 0) {
      const foundersToInsert = founderNames.map(name => ({
        id: crypto.randomUUID(),
        companyId,
        name,
      }));
      
      await db.insert(founders).values(foundersToInsert);
    }
    
    return NextResponse.json({ id: companyId }, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}

export async function GET() {//req: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get user's companies
    const userCompanies = await db
      .select()
      .from(companies)
      .where(eq(companies.userId, session.user.id))
      .then(rows => rows);
    
    return NextResponse.json(userCompanies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
//
//export type paramsType = Promise<{ id: string }>;
//export async function DELETE(
//  _req: NextRequest,
//  params: { params: paramsType }
//): Promise<NextResponse> {
//  try {
//    // Get authenticated user
//    const session = await getServerSession(authOptions);
//    
//    if (!session?.user) {
//      return NextResponse.json(
//        { error: "Unauthorized" },
//        { status: 401 }
//      );
//    }
//    
//    // Get company ID from route parameter
//    //const companyId = (await params).id; //params.id;
//    const { id: companyId } = await params.params;
//    
//    // Check if company exists and belongs to user
//    const company = await db
//      .select()
//      .from(companies)
//      .where(eq(companies.id, companyId))
//      .where(eq(companies.userId, session.user.id))
//      .all();
//    
//    if (!company || company.length === 0) {
//      return NextResponse.json(
//        { error: "Company not found or unauthorized" },
//        { status: 404 }
//      );
//    }
//    
//    // Delete company record
//    await db.delete(companies).where(eq(companies.id, companyId));
//    
//    // Delete founder records
//    await db.delete(founders).where(eq(founders.companyId, companyId));
//    
//    return NextResponse.json({ message: "Company deleted successfully" });
//  } catch (error) {
//    console.error("Error deleting company:", error);
//    return NextResponse.json(
//      { error: "Failed to delete company" },
//      { status: 500 }
//    );
//  }
//}
//