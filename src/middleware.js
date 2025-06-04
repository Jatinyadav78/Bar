// import { NextRequest, NextResponse } from "next/server";

// // const protectedRoutes = ["/dashboard", "/status/pending","/status/request","/status/approved/","/status/approved/:path"];
// // Function to determine authentication status
// export const config = {
//     matcher: ['/dashboard', '/status/pending/:path*','/status/rejected/:path*','/status/approved/:path*', '/status/closed/:path*','/image/:path*'],
//   }
// export default function middleware(req, res, next) { 
//   const verify = req.cookies.get("loggedIn");
//   if (!verify) {
//     const absoluteUrl = new URL(
//       `/?returnUrl=${req.nextUrl.pathname}`,
//       req.nextUrl.origin
//     );
//     return NextResponse.redirect(absoluteUrl.toString());
//   }
// }

// // export const config = {
// //   matcher: [
// //     // Match protected routes (adjust as needed)
// //     "/dashboard",
// //     "/status/pending/:pendingId", // Match /status/pending/ with dynamic parameter
// //     "/status/approved/:id", // Match /status/approved/ with dynamic parameter
// //     "/status/:id",
// //   ],
// // };

// // export default function middleware(req) {
// //   const verify = req.cookies.get("loggedIn");
// //   console.log("aasas",verify)
// //   const { pathname } = req.nextUrl;
// //   // Check if protected route (excluding /status/ followed by any number) and authentication status
// //   if (
// //     !verify &&
// //     (pathname !== "/status/:id" || !pathname.startsWith("/status/"))
// //   ) {
// //     // Note the double negation (!!) to ensure both conditions are met
// //     const absoluteUrl = new URL(
// //       `/?returnUrl=${req.nextUrl.pathname}`,
// //       req.nextUrl.origin
// //     );
// //     return NextResponse.redirect(absoluteUrl.toString());
// //   }

// //   return NextResponse.next(); // Allow access to non-protected routes or authenticated users
// // }
// // export { default } from "next-auth/middleware";

// // export const config = { matcher: ["/dashboard","/status"]};





import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: ['/dashboard', '/safety-dashboard', '/fir-dashboard', '/status/pending/:path*','/status/rejected/:path*','/status/approved/:path*', '/status/closed/:path*','/image/:path*'],
}

export default function middleware(req, res, next) { 
  const verify = req.cookies.get("loggedIn");
  if (!verify) {
    const absoluteUrl = new URL(
      `/?returnUrl=${req.nextUrl.pathname}`,
      req.nextUrl.origin
    );
    return NextResponse.redirect(absoluteUrl.toString());
  }
}
