import { NextApiRequest, NextApiResponse } from "next";
import {
  getItemById,
  deleteById,
  replaceById,
  updateById,
} from "../../../lib/fauna";

type Data = {
  item?: Item;
  message?: string;
};

export default async (
  { method, query, body }: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { itemId } = query;

  if (method === "GET") {
    const item = await getItemById("items", itemId as string);

    if (!item) return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json({ item });
  }

  if (method === "DELETE") {
    const item = await deleteById("items", itemId as string);

    if (!item) return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json({ item });
  }

  if (method === "PUT") {
    const item = await replaceById("items", itemId as string, body);

    if (!item) return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json({ item });
  }

  if (method === "PATCH") {
    const item = await updateById("items", itemId as string, body);

    if (!item) return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json({ item });
  }

  res.status(405).json({ message: "Method not available" });
};
