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
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
      <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100;0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100;0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />
      <style type="text/css">{`
        body {
            background-color: ${background || 'none'};
            padding: 0;
            margin: 0;
        }
        p {
            font-size: 12px;
        }
    `}</style>
    </Head>
    {children}
  </div>
}
