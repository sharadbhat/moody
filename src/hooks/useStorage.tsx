import { IDBPDatabase, openDB } from "idb";
import { useMoodyStore } from "../utils/store";

const DB_NAME = "moodyDB";
const STORE_NAME = "boards";
const LAST_BOARD_ID_STORE_NAME = "lastBoardId";

const VERSION = 1;

export const useStorage = () => {
  let dbPromise: Promise<IDBPDatabase> | null = null;

  const getDb = async () => {
    if (!dbPromise) {
      dbPromise = openDB(DB_NAME, VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, {
              keyPath: "id",
            });
            store.createIndex("boardId", "boardId", { unique: true });
          }

          if (!db.objectStoreNames.contains(LAST_BOARD_ID_STORE_NAME)) {
            db.createObjectStore(LAST_BOARD_ID_STORE_NAME, {
              keyPath: "id",
            });
          }
        },
      });
    }
    return dbPromise;
  };

  const saveBoard = async () => {
    const moodyStore = useMoodyStore.getState();

    const filteredStore = Object.fromEntries(
      Object.entries(moodyStore).filter(
        ([_, value]) => typeof value !== "function"
      )
    );

    const { boardId } = moodyStore;

    if (!boardId || typeof boardId !== "string") {
      console.error("Invalid boardId:", boardId);
      return;
    }

    const db = await getDb();

    await db.put(STORE_NAME, {
      id: boardId,
      ...filteredStore,
    });

    await db.put(LAST_BOARD_ID_STORE_NAME, {
      id: "lastBoardId",
      value: boardId,
    });
  };

  const loadBoard = async (id?: string) => {
    const db = await getDb();

    let boardId = id;
    if (!boardId) {
      const last = await db.get(LAST_BOARD_ID_STORE_NAME, "lastBoardId");
      boardId = last?.value;
    }

    if (boardId) {
      const savedBoard = await db.get(STORE_NAME, boardId);

      const { id, ...rest } = savedBoard;
      useMoodyStore.getState().setStateFromIndexedDB(rest);
    }
  };

  const getAllBoards = async () => {
    const db = await getDb();

    const allBoards = await db.getAll(STORE_NAME);
    const filteredBoards = allBoards.map(({ id, boardName }) => ({
      id,
      boardName,
    }));
    return filteredBoards;
  };

  const deleteBoard = async (id: string) => {
    const db = await getDb();
    await db.delete(STORE_NAME, id);
  };

  return {
    saveBoard,
    loadBoard,
    getAllBoards,
    deleteBoard,
  };
};
