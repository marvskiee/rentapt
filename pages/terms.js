import { HeaderLayout, AuthLayout, FooterLayout } from "../components";
import React from "react";
import Link from "next/link";

const Terms = () => {
  return (
    <>
      <div>
        <HeaderLayout title="Terms" />
        <div className="flex items-center justify-center my-20 min-h-screen px-8 ">
          <div className="z-10 bg-white rounded-md p-8 flex-col gap-4 flex sm:mx-20 mx-10 ">
            <img
              src="logo.png"
              className="m-auto w-full sm:w-96 object-cover "
            />

            <div className="flex flex-col gap-5">
              <p className="text-xl font-semibold">
                Payment terms and conditions
              </p>
              <p className="text-md font-semibold">No Payment Proof</p>
              <ul className="list-disc pl-10">
                <li>
                  Tenant who do not pay the exact amount can't approve by the
                  admin.
                </li>
                <li>Tenant who put wrong proof can't approve by the admin.</li>
              </ul>
              <p className="text-md font-semibold">
                Tenant are allowed to pay to the office during office hours.
              </p>
              <p className="text-md font-semibold">
                Tenant are allowed to pay via Gcash or Paymaya and direct to the
                office.
              </p>
              <p className="text-md font-semibold">Privacy policy</p>
              <p className="text-md font-semibold">Privacy Notice</p>
              <p>
                At Rentapt an online apartment monitoring system for 12
                Apartment, we are committed to protecting and respecting your
                privacy. Please read this notice as it contains important
                information about how we use personal data that we collect to
                the client.
              </p>
              <p className="text-md font-semibold">Information and Consent</p>
              <p>
                This privacy notice describe how we collect, use, process and
                disclose your information, including the personal information
                about you. <br />
                By reading this privacy notice, the user is hereby informed on
                how we collect, process and protect personal data furnished
                through the account management.
                <br />
                The user must carefully read this Privacy Notice, which has been
                written clearly to understanding and to freely and voluntarily
                determine whether they wish to provide their information or
                personal data.
                <br />
                By accessing the platform, you agree to our privacy practices as
                set out in this privacy statement.
              </p>
              <p className="text-md font-semibold">Exercise of Rights</p>
              <p>
                The tenant can visit in office hours:
                <br />- To access their personal details.
              </p>
              <p className="text-md font-semibold">Security Measures</p>
              <p>
                We will process the client data at all times in a confidential
                way and maintaining the mandatory secrecy with regard with the
                data.
              </p>
              <Link href="/">
                <button className="bg-zinc-900 w-full p-2 text-center rounded-md text-white">
                  I understand and go back to login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <FooterLayout />
      <img
        src="/bg.jpg"
        className="-z-10 object-cover fixed top-0 left-0 w-screen h-screen"
      />
    </>
  );
};

export default Terms;
