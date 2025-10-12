import { NextResponse } from "next/server";
import { createUser } from "@/lib/services/userService";
import { ValidationError, ConflictError } from "@/lib/types/user";
import { type CreateUserDto } from "@/lib/types/user";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Create user using service
    const user = await createUser(data as CreateUserDto);

    // Return success response
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof ConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
