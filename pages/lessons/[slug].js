import PremiumContent from "@components/PremiumContent";
import { useRouter } from "next/router";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@lib/firebase";
import ReactMarkdown from "react-markdown";
import Head from "next/head";

export default function LessonPage({}) {
  return (
    <PremiumContent>
      <Lesson />
    </PremiumContent>
  );
}

function Lesson() {
  const [lesson, setLesson] = useState({});
  const router = useRouter();
  const { slug } = router.query;

  const fetchLesson = async (slug) => {
    const docRef = doc(db, "lessons", slug);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      setLesson(docSnapshot.data());
    } else {
      console.log("lawl");
    }
  };

  if (slug && !lesson.title) {
    console.log("Fetching lesson", slug, lesson.title);
    fetchLesson(slug);
  }

  return (
    <>
      <Head>
        <title>{lesson?.title}</title>
      </Head>
      <ReactMarkdown>{lesson?.content}</ReactMarkdown>
    </>
  );
}
