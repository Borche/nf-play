import PremiumContent from "@components/PremiumContent";
import Link from "next/link";
import { useState } from "react";
import { db } from "@lib/firebase";
import { query, orderBy, getDocs, collection } from "firebase/firestore";

export default function LessonsPage({}) {
  return (
    <PremiumContent>
      <AllLessons />
    </PremiumContent>
  );
}

function AllLessons() {
  const [lessons, setLessons] = useState([]);
  const [fetched, setFetched] = useState(false);

  const getAllLessons = async () => {
    const snapshot = await getDocs(query(collection(db, "lessons"), orderBy("updatedAt", "desc")));
    const allLessons = snapshot.docs.map((lesson) => lesson.data());
    console.log(allLessons);
    setLessons(allLessons);
  };

  if (!fetched) {
    setFetched(true);
    getAllLessons();
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
      </ul>
    </>
  );
}
