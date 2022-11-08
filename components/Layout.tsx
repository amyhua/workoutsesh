import Head from 'next/head'
import styles from './Layout.module.css'

export default function Layout({
  children,
  title,
  description='',
  background='white',
}: {
  children: any;
  title: string;
  description?: string;
  background?: string;
}) {
  return <div className={styles.container}>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description || 'Workout Sesh lets you workout like you\'re playing a song.'} />
      <style>{`
        body {
          background: ${background};
        }
      `}</style>
    </Head>
    {children}
  </div>
}
