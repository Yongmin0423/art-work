import { Resend } from "resend";
import type { Route } from "./+types/welcome-page";
import RaycastMagicLinkEmail from "react-email-starter/emails/welcome-user";

const client = new Resend(process.env.RESEND_API_KEY);

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { data, error } = await client.emails.send({
    from: "Artwork Manager <artwokr@mail.artwor.forum>",
    to: "yym21345@gmail.com",
    subject: "welcome to Artwork!",
    react: <RaycastMagicLinkEmail />,
  });
  return Response.json({ data, error });
};
