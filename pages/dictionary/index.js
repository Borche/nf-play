import PremiumContent from "@components/PremiumContent";
import { useState } from "react";
import { auth, db } from "@lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function DictionaryPage({}) {
  const [formValue, setFormValue] = useState("");
  const [word, setWord] = useState(null);

  const search = async (e) => {
    console.log(e.target.value);
    setFormValue(e.target.value);

    if (e.target.value.length >= 1) {
      const docRef = doc(db, "words", e.target.value);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setWord(docSnap.data()?.translations?.swedish);
      }
    }
  };

  return (
    <PremiumContent>
      <>
        <h1>Dictionary Page</h1>
        <div>
          Search <input name="q" type="text" value={formValue} onChange={search}></input>
        </div>
        <div>Word: {word}</div>
      </>
    </PremiumContent>
  );
}
