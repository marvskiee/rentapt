import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { verify } from "./services/jwt_sign_verify";
export default async function middleware(req) {
  const secret = process.env.SECRET;

  let jwt = req.cookies.get("OursiteJWT");
  let url = req.url;

  // online domain for heroku
  const domain = process.env.CUSTOMDOMAIN;

  // offline domain for localhost
  // const domain = "http://localhost:3000/";
  // console.log(verifys);

  let tmp_url = url;
  let pathname = "/" + tmp_url.replace(domain, "");
  // try {
  //   await verify(jwt, secret);
  //   return NextResponse.next();
  // } catch (error) {
  //   // console.log(error);
  //   // return NextResponse.redirect("/login");
  // }
  try {
    if (jwt) {
      const res = await verify(jwt, secret);
      if (pathname == "/" || pathname == "/admin") {
        if (res.role == "user") {
          return NextResponse.redirect(`${domain}user/rental_payment`);
        } else {
          return NextResponse.redirect(`${domain}admin/tenant_account`);
        }
      }
      switch (pathname) {
        case "/admin/tenant_account":
        case "/admin/account_maintenance":
        case "/admin/account_notification":
        case "/admin/rental_payment_request":
        case "/admin/repair_payment_request":
        case "/admin/summary_report":
          if (res.role == "admin") {
            return NextResponse.next();
          } else {
            return NextResponse.redirect(`${domain}user/rental_payment`);
          }
        case "/user/rental_payment":
        case "/user/repair_payment":
        case "/user/repair_request":
        case "/user/utility_record":
          if (res.role == "user") {
            return NextResponse.next();
          } else {
            return NextResponse.redirect(`${domain}admin/tenant_account`);
          }
      }
    } else {
      switch (pathname) {
        case "/admin/tenant_account":
        case "/admin/account_maintenance":
        case "/admin/account_notification":
        case "/admin/rental_payment_request":
        case "/admin/repair_payment_request":
        case "/admin/summary_report":
          return NextResponse.redirect(`${domain}admin`);
        case "/user/rental_payment":
        case "/user/repair_payment":
        case "/user/repair_request":
        case "/user/utility_record":
          return NextResponse.redirect(`${domain}`);
      }
    }
  } catch (e) {}

  // configuration
  if (req.nextUrl.pathname.startsWith("/_next")) return NextResponse.next();
  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    pathname.startsWith("/api") || //  exclude all API routes
    pathname.startsWith("/static") || // exclude static files
    pathname.includes(".") // exclude all files in the public folder
  )
    return NextResponse.next();

  const PUBLIC_FILE = /\.(.*)$/;
  if (PUBLIC_FILE.test(pathname)) return NextResponse.next();
  // if (!verifys) {
  //
  // }
}
