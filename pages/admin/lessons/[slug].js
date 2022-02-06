import AdminContent from "@components/AdminContent";
import { useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@lib/firebase";
import ReactMarkdown from "react-markdown";
import { useForm } from "react-hook-form";
import styles from "../admin.module.css";
import toast from "react-hot-toast";

export default function ManageLessonPage() {
  const [lesson, setLesson] = useState({});
  const router = useRouter();
  const slug = router.query.slug;

  const getLessonData = async (slug) => {
    try {
      const docRef = doc(db, "lessons", slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Lesson", docSnap.data());
        setLesson(docSnap.data());
      }
    } catch (err) {
      console.error("Fetching lesson error", err);
    }
  };

  if (slug && !lesson.slug) {
    getLessonData(slug);
  }

  return <AdminContent>{lesson.slug ? <LessonEditor lesson={lesson} /> : "Loading lesson..."}</AdminContent>;
}

function LessonEditor({ lesson }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isValid, errors },
  } = useForm({ defaultValues: lesson, mode: "onChange" });

  const updateLesson = async ({ content, published }) => {
    try {
      const docRef = doc(db, "lessons", lesson.slug);
      await updateDoc(docRef, {
        content,
        published,
        updatedAt: serverTimestamp(),
      });

      reset({ content, published });

      toast.success("Lesson updated successfully!");
    } catch (err) {
      console.error("Update lesson error", err);

      toast.error("Error updating lesson!");
    }
  };

  return (
    <>
      <h1>Manage Lesson Page</h1>
      <h2>{lesson.title}</h2>
      <h3>Slug: {lesson.slug}</h3>

      <form onSubmit={handleSubmit(updateLesson)}>
        <LessonContent register={register} errors={errors} content={lesson.content} />
        <ButtonBar isDirty={isDirty} isValid={isValid} />
      </form>
    </>
  );
}

function LessonContent({ errors, register }) {
  return (
    <>
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
    </>
  );
}

function ButtonBar({ isDirty, isValid }) {
  return (
    <div className={styles.buttonBar}>
      <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
        Save Changes
      </button>
      <button className="btn-blue">Preview</button>
      <button className="btn-yellow">Live</button>
    </div>
  );
}
