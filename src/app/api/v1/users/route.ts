import { NextResponse } from "next/server";

interface User {
    name: string;
    age: number;
    email: string;
}

const users: User[] = []


export function GET() {


    return NextResponse.json({
        message: "Success",
        data: users
    })


}


export async function POST(req: Request) {

    const body = await req.json() // data sent using body

    users.push(body.user)

    return NextResponse.json({
        message: "Success",
        data: users,
    }, {
        status: 201
    })


}