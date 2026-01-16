import { GameManager } from "@/components/GameManager";
import { firestoreDB } from "@/lib/firebase";
import { Game } from "@/lib/types/game";
import { doc, getDoc } from "firebase/firestore";

type Params = Promise<{ id: string }>;

async function getGame(gameId: string) {
  const docRef = doc(firestoreDB, "games", gameId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  // Map Firestore data to our Game interface
  return { uid: docSnap.id, ...docSnap.data() } as Game;
}

const page = async (props: { params: Params }) => {
  const params = await props.params;
  const id = params.id;

  const game = await getGame(id);

  return (
    <div className="w-full">
      <GameManager
        gameRounds={game?.rounds}
        pageId={id}
        gameTitle={game?.title}
      />
    </div>
  );
};

export default page;
