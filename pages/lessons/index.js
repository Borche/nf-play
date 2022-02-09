import PremiumContent from "@components/PremiumContent";
import Link from "next/link";
import { useState } from "react";
import { db, postToJSON } from "@lib/firebase";
import { query, orderBy, getDocs, collection, where } from "firebase/firestore";

export async function getServerSideProps() {
  // Load free (non-premium) lessons here
  const q = query(collection(db, "lessons"), where("premium", "==", false));
  const lessons = (await getDocs(q)).docs.map(postToJSON);

  return {
    props: { lessons },
  };
}

export default function LessonsPage({ lessons }) {
  return (
    <PremiumContent>
      <AllLessons lessons={lessons} />
    </PremiumContent>
  );
}

function AllLessons({ lessons }) {
  const [premiumLessons, setPremiumLessons] = useState([]);
  const [fetched, setFetched] = useState(false);

  const getPremiumLessons = async () => {
    const snapshot = await getDocs(
      query(collection(db, "lessons"), where("premium", "==", true), orderBy("updatedAt", "desc"))
    );
    const allLessons = snapshot.docs.map((lesson) => lesson.data());
    console.log(allLessons);
    setPremiumLessons(allLessons);
  };

  if (!fetched) {
    setFetched(true);
    getPremiumLessons();
  }

  return (
    <>
      <h2>All lessons</h2>
      <ul>
        {/* Some headers for our "table" */}
        <li>
          <span>Title</span>
        </li>

        {lessons.map((lesson) => (
          <li key={lesson.slug}>
            <Link href={`/lessons/${lesson.slug}`}>
              <a>{lesson.title}</a>
            </Link>
          </li>
        ))}
        {premiumLessons.map((lesson) => (
          <li key={lesson.slug}>
            <Link href={`/lessons/${lesson.slug}`}>
              <a>{lesson.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
