import { IDBPDatabase, openDB } from "idb";
import { useMoodyStore } from "../utils/store";
import { BoardData } from "../utils/types";

const DB_NAME = "moodyDB";
const STORE_NAME = "boards";
const LAST_BOARD_ID_STORE_NAME = "lastBoardId";

const VERSION = 1;

const REMOVE_KEYS = [
  "boardList",
  "boardLoading",
  "selectedCanvasObjectId",
  "selectedCanvasObjectRef",
];

export const useStorage = () => {
  const { setBoardList, setBoardLoading } = useMoodyStore();
  let dbPromise: Promise<IDBPDatabase> | null = null;

  const shouldSaveBoard = () => {
    const moodyStore = useMoodyStore.getState();
    const {
      boardName,
      patternColor,
      backgroundColor,
      canvasObjectList,
      backgroundPatternId,
    } = moodyStore;

    if (boardName !== "Untitled") {
      return true;
    }

    if (patternColor !== "#000000") {
      return true;
    }
    if (backgroundColor !== "#ffffff") {
      return true;
    }
    if (canvasObjectList.length !== 0) {
      return true;
    }
    if (backgroundPatternId !== 0) {
      return true;
    }

    return false;
  };

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

  const saveBoard = async (bypassCheck?: boolean) => {
    const moodyStore = useMoodyStore.getState();

    const filteredStore = Object.fromEntries(
      Object.entries(moodyStore).filter(
        ([_, value]) => typeof value !== "function"
      )
    );

    REMOVE_KEYS.forEach((key) => delete filteredStore[key]);

    const { boardId } = filteredStore;

    if (!bypassCheck && !shouldSaveBoard()) {
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

  const saveAndLoadAllBoardsIntoStore = async (bypassCheck?: boolean) => {
    await saveBoard(bypassCheck);
    await loadAllBoardsIntoStore();
  };

  const loadAllBoardsIntoStore = async () => {
    const db = await getDb();

    const allBoards = await db.getAll(STORE_NAME);
    const filteredBoards = allBoards.map(({ id, boardName }: BoardData) => ({
      id,
      boardName,
    }));

    setBoardList(filteredBoards);
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

      await db.put(LAST_BOARD_ID_STORE_NAME, {
        id: "lastBoardId",
        value: boardId,
      });
    }
  };

  const saveAndLoadBoard = async (id?: string) => {
    setBoardLoading(true);
    await saveBoard();
    await loadBoard(id);
    setBoardLoading(false);
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
    loadAllBoardsIntoStore,
    saveAndLoadBoard,
    saveAndLoadAllBoardsIntoStore,
  };
};
