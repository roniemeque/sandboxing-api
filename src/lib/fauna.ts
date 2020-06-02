import faunadb, { query as q } from "faunadb";

/**
 * Importante: FaunaDB recomenda criar as conexoes dentro do contexto dos handlers
 * Nao ha vantagem em usar hot containers para reaproveitar as conexoes neste caso
 * ref: https://docs.fauna.com/fauna/current/drivers/aws
 */

const client = new faunadb.Client({
  secret: process.env.FAUNA_KEY,
});

const transformFaunaResult = ({ ref, ts, data }: FaunaItem): Item => ({
  id: ref?.value?.id,
  ts,
  ...data,
});

interface FaunaItem {
  ref: {
    value: {
      id: string;
    };
  };
  ts: any;
  data: {
    [key: string]: any;
  };
}

export const allItemsByIndex = async (
  indexName: string,
  itemType: string
): Promise<Item[] | null> => {
  try {
    const { data } = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index(indexName), itemType)),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    );

    return data?.map((item: FaunaItem) => transformFaunaResult(item));
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getItemById = async (
  collectionName: string,
  id: string
): Promise<Item | null> => {
  try {
    const result: FaunaItem = await client.query(
      q.Get(q.Ref(q.Collection(collectionName), id))
    );

    return transformFaunaResult(result);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createItem = async (
  collectionName: string,
  dataToCreate: any,
  itemType: string
): Promise<Item | null> => {
  try {
    const result: FaunaItem = await client.query(
      q.Create(q.Collection(collectionName), {
        data: { ...dataToCreate, type: itemType },
      })
    );

    return transformFaunaResult(result);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteById = async (
  collectionName: string,
  id: string
): Promise<any> => {
  try {
    const result: FaunaItem = await client.query(
      q.Delete(q.Ref(q.Collection(collectionName), id))
    );

    return transformFaunaResult(result);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const replaceById = async (
  collectionName: string,
  id: string,
  newData: any
): Promise<any> => {
  try {
    const result: FaunaItem = await client.query(
      q.Replace(q.Ref(q.Collection(collectionName), id), {
        data: {
          ...newData,
        },
      })
    );

    return transformFaunaResult(result);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateById = async (
  collectionName: string,
  id: string,
  newData: any
): Promise<any> => {
  try {
    const result: FaunaItem = await client.query(
      q.Update(q.Ref(q.Collection(collectionName), id), {
        data: {
          ...newData,
        },
      })
    );

    return transformFaunaResult(result);
  } catch (error) {
    console.error(error);
    return null;
  }
};
