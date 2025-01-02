import prisma from "@/lib/prisma";

interface RoleProp {
  email: string;
}

export const fetchCurrentUser = async ({ email }: RoleProp) => {
  return await prisma.user.findUnique({
    select: {
      email: true,
      role: true,
    },
    where: {
      email: email,
    },
  });
};
