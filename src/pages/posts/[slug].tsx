import { GetServerSideProps, GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";

import { getPrismicClient } from "../../services/prismic";

import styles from './post.module.scss';

interface PostResponse {
    first_publication_date: string,
    data: {
        title: string;
        content: [];
    }
}


interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function Post({ post }: PostPreviewProps) {
    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>

        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req })
    const { slug } = params;

    if (!session?.activeSubscription) {
        return {
            redirect: {
                destination: `/posts/preview/${slug}`,
                permanent: false,
            }
        }
    }

    const prismic = getPrismicClient(req);

    const response = await prismic.getByUID('post', String(slug), {}) as PostResponse;

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.first_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    };

    return {
        props: {
            post
        }
    }
}