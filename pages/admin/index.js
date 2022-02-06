import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

import { UserContext } from "@lib/context";
import { auth, serverTimestamp, db } from "@lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import AdminContent from "@components/AdminContent";
import styles from "./admin.module.css";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

export default function AdminPage({}) {
  return (
    <AdminContent>
      <main>
        <h1>Admin Page</h1>
        <CreateNewLesson />
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
      content: "# Counting from 1 to 10",
      createdByUid: uid,
      createdByUsername: username,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);

    toast.success("YEAH! Lesson created!");

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
