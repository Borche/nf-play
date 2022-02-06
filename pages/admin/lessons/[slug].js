import AdminContent from "@components/AdminContent";
import { useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@lib/firebase";
import ReactMarkdown from "react-markdown";
import { useForm } from "react-hook-form";
import styles from "../admin.module.css";

export default function ManageLessonPage() {
  const router = useRouter();
  const [lesson, setLesson] = useState({});
  const [docRef, setDocRef] = useState(null);
  const slug = router.query.slug;

  const getLessonData = async (slug) => {
    const docRef = doc(db, "lessons", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Data", docSnap.data());
      setLesson(docSnap.data());
      setDocRef(docRef);
    }
  };

  if (slug && (!lesson || !lesson.slug)) {
    getLessonData(slug);
  }

  return (
    <AdminContent>
      <h1>Manage Lesson Page</h1>
      <h2>{lesson.title}</h2>
      <h3>Slug: {lesson.slug}</h3>
      <LessonContent defaultValues={lesson} lessonRef={docRef} />
    </AdminContent>
  );
}

function LessonContent({ defaultValues, lessonRef }) {
  console.log("LessonRef", lessonRef);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isValid, errors },
  } = useForm({ defaultValues, mode: "onChange" });

  const updateLesson = async ({ content, published }) => {
    try {
      await updateDoc(lessonRef, {
        content,
        published,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Andreas error", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(updateLesson)}>
      <textarea
        name="content"
        {...register("content", {
          required: { value: true, message: "Content is required" },
          minLength: { value: 10, message: "Content is too short" },
          maxLength: { value: 20000, message: "Content is too long" },
        })}
        rows="20"
      ></textarea>

      {errors.content && <p className="text-danger">Validation error: {errors.content.message}</p>}

      <fieldset>
        <label>
          <input className={styles.checkbox} name="published" type="checkbox" {...register("published")} />
          Published
        </label>
      </fieldset>

      <div className={styles.buttonBar}>
        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
        <button className="btn-blue">Preview</button>
        <button className="btn-yellow">Live</button>
      </div>
    </form>
  );
}
