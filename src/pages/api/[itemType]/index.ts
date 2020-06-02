import { NextApiRequest, NextApiResponse } from "next";
import { allItemsByIndex, createItem } from "../../../lib/fauna";

type Data = {
  items?: Item[];
  item?: Item;
  message?: string;
};

export default async (
  { method, body, query }: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { itemType } = query;

  if (method === "GET") {
    const items = await allItemsByIndex(
      "all_items_by_type",
      itemType as string
    );

    if (!items)
      return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json({ items });
  }

  if (method === "POST") {
    const item = await createItem("items", body, itemType as string);

    if (!item) return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json({ item });
  }

  res.status(405).json({ message: "Method not available" });
};
