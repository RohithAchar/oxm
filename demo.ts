// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     // Parse request body
//     const body = await req.json();

//     // Input validation
//     const { email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json(
//         {
//           error: "Validation failed",
//           message: "Email and password are required",
//           fields: {
//             email: !email ? "Email is required" : null,
//             password: !password ? "Password is required" : null,
//           },
//         },
//         { status: 400 }
//       );
//     }

//     // Your business logic here
//     // const result = await someAsyncOperation(email, password);

//     return NextResponse.json(
//       {
//         success: true,
//         data: result,
//         message: "Operation completed successfully",
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("API Error:", error);

//     // Handle JSON parsing errors
//     if (error instanceof SyntaxError) {
//       return NextResponse.json(
//         {
//           error: "Invalid JSON",
//           message: "Request body must be valid JSON",
//         },
//         { status: 400 }
//       );
//     }

//     // Handle specific error types
//     if (error.name === "ValidationError") {
//       return NextResponse.json(
//         {
//           error: "Validation failed",
//           message: error.message,
//           details: error.details,
//         },
//         { status: 400 }
//       );
//     }

//     if (error.name === "UnauthorizedError") {
//       return NextResponse.json(
//         {
//           error: "Unauthorized",
//           message: "Invalid credentials",
//         },
//         { status: 401 }
//       );
//     }

//     // Database connection errors
//     if (error.code === "ECONNREFUSED") {
//       return NextResponse.json(
//         {
//           error: "Service unavailable",
//           message: "Database connection failed",
//         },
//         { status: 503 }
//       );
//     }

//     // Generic server error
//     return NextResponse.json(
//       {
//         error: "Internal server error",
//         message:
//           process.env.NODE_ENV === "development"
//             ? error.message
//             : "Something went wrong",
//       },
//       { status: 500 }
//     );
//   }
// }

// Client
// catch (error: any) {
//       console.error("Frontend API Error:", error);

//       if (axios.isAxiosError(error)) {
//         const status = error.response?.status;
//         const message =
//           error.response?.data?.message || "Unknown error occurred";

//         switch (status) {
//           case 400:
//             toast.error("Bad Request: " + message);
//             break;
//           case 401:
//             toast.error("Unauthorized: " + message);
//             // Optionally redirect to login
//             break;
//           case 503:
//             toast.error("Service Unavailable: " + message);
//             break;
//           case 500:
//             toast.error("Server Error: " + message);
//             break;
//           default:
//             toast.error("Error: " + message);
//         }
//       } else {
//         // Non-Axios errors
//         toast.error("Unexpected error: " + error.message || error.toString());
//       }
//     }
