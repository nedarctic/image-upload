import { getSession } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

// Make sure that cookies are awaited properly
export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  // Awaiting the getSession to make sure cookie data is fully loaded
  const session = await getSession(req, res);

  // If the user is not logged in, return an empty object
  if (!session || typeof session === 'undefined') return {};

  const { user, accessToken } = session;

  return {
    user,
    accessToken,
  };
}