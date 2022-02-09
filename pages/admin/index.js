import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { FaRegCheckCircle, FaRegTimesCircle, FaDollarSign } from "react-icons/fa";

import { UserContext } from "@lib/context";
import { auth, serverTimestamp, db } from "@lib/firebase";
import { query, orderBy, doc, setDoc, getDocs, collection } from "firebase/firestore";
import AdminContent from "@components/AdminContent";
import styles from "./admin.module.css";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import { format, formatDistance } from "date-fns";

export default function AdminPage({}) {
  return (
    <AdminContent>
      <main>
        <CreateNewLesson />
        <br />
        <AllLessons />
      </main>
    </AdminContent>
  );
}

function CreateNewLesson() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  const slug = encodeURI(kebabCase(title));

  const isValid = title.length >= 5 && title.length < 100;

  const createNewLesson = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(db, "lessons", slug);

    const data = {
      title,
      slug,
      published: false,
      premium: true,
      content: "# Example title",
      createdByUid: uid,
      createdByUsername: username,
      updatedByUid: uid,
      updatedByUsername: username,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(ref, data);

    toast.success(`Lesson "${title}" created!`);

    router.push(`/admin/lessons/${slug}`);
  };

  return (
    <form onSubmit={createNewLesson}>
      <label>
        Lesson name <br />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome New Lesson!"
          name="lessonName"
          type="text"
          className={styles.lessonTitleInput}
          autoComplete="off"
        />
      </label>
      <br />
      <button type="submit" disabled={!isValid} className="btn-green mts">
        Create New Lesson
      </button>
    </form>
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
        <li className={styles.lessonItem}>
          <span className={styles.headerPublished}></span>
          <span className={styles.headerTitle}>Title</span>
          <span className={styles.headerLastUpdated}>Last updated</span>
          <span className={styles.headerCreated}>Created</span>
          <span className={styles.headerPremium}>Premium</span>
        </li>

        {lessons.map((lesson) => (
          <li className={styles.lessonItem} key={lesson.slug}>
            <span className={styles.colPublished}>
              {lesson.published ? (
                <FaRegCheckCircle style={{ color: "#2cbd72", fontSize: "2.4rem" }} />
              ) : (
                <FaRegTimesCircle style={{ color: "#eb9696", fontSize: "2.4rem" }} />
              )}
            </span>

            <Link href={`/admin/lessons/${lesson.slug}`}>
              <a className={styles.colTitle}>{lesson.title}</a>
            </Link>

            <span className={styles.colLastUpdated}>
              {formatDistance(lesson.updatedAt.toDate(), new Date(), { addSuffix: true })} by
              <span className={styles.username}> {lesson.createdByUsername}</span>
            </span>

            <span className={styles.colCreated}>
              {formatDistance(lesson.createdAt.toDate(), new Date(), { addSuffix: true })} by
              <span className={styles.username}> {lesson.createdByUsername}</span>
            </span>

            <span className={styles.colPremium}>
              {lesson.premium && <FaDollarSign style={{ color: "#359315", fontSize: "2rem" }} />}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
