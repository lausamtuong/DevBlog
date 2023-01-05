import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getBlogs } from "../server/blog";
import { BlogPost } from "../types/blogType";
import { useMemo, useState } from "react";
import BlogPreview from "../components/BlogPreview";
import Typewriter from "typewriter-effect";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = ({
  blogData,
  tags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [filterWord, setFilterWord] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number[]>([]);
  const filteredBlog: BlogPost[] = useMemo(() => {
    return filterWord.length > 0
      ? blogData.filter((blog: BlogPost) => {
          return filterWord.every((filter) => blog.tags.includes(filter));
        })
      : blogData;
  }, [filterWord]);
  const filterLabel = (tag: any, idx: number) => {
    if (selectedIdx.includes(idx)) {
      setSelectedIdx(selectedIdx.filter((id) => id !== idx));
      setFilterWord(filterWord.filter((filter) => filter !== tag.innerText));
    } else {
      setSelectedIdx([...selectedIdx, idx]);
      setFilterWord([...filterWord, tag.innerText]);
    }
  };

  return (
    <main className="layout">
      <title> Home Page </title>
      <section>
        <div className="mt-3 text-center">
          <h1 className="text-[3rem]">🔥BLOG🔥</h1>
          <Typewriter
            options={{
              strings: [" Welcome to DevBlog","Author: Obs Tuong","My Github: https://github.com/lausamtuong"],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </section>
      <section className="flex flex-col items-center text-[1.15rem] mt-12">
        <div className="flex gap-3 p-7 border-2 border-red-400 rounded-xl mb-5">
          {tags.map((tag: string, idx: number) => {
            return (
              <button
                className={`${
                  selectedIdx.includes(idx)
                    ? "label-selected hover:bg-sky-400 transition-all duration-300"
                    : "label hover:bg-sky-400 transition-all duration-300"
                }`}
                key={idx}
                onClick={(e) => filterLabel(e.target, idx)}
              >
                {tag}
              </button>
            );
          })}
        </div>
        {filteredBlog.map((blog: BlogPost) => {
          return (
            <div
              key={blog.id}
              className="max-w-[28em] max-h-[20em] overflow-hidden mx-6 mb-6 bg-neutral-300 text-zinc-800 rounded-lg p-4 hover:bg-neutral-500 hover:text-neutral-300 transition-all duration-300"
            >
              <a href={blog.url} target="_blank" rel="noreferrer">
                <BlogPreview
                  title={blog.title}
                  bodyText={blog.bodyText}
                  createdAt={blog.createdAt}
                  author={blog.author}
                  tags={blog.tags}
                />
              </a>
            </div>
          );
        })}
      </section>
    </main>
  );
};
export default Home;
export const getServerSideProps: GetServerSideProps = async () => {
  let blogs: BlogPost[] = await getBlogs();
  let tags: string[] = [];
  for (const blog of blogs) {
    for (const tag of blog.tags) {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
  }
  console.log(tags);
  return {
    props: {
      blogData: blogs,
      tags: tags,
    },
  };
};
