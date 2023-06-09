import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapState } from '@/context/map/MapState';
import MapApp from '@/components/MapApp';

export default function Home() {
  return (
    <>
      <Head>
        <title>Map My Model</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <MapState>
          <MapApp>
          </MapApp>
        </MapState>
      </main>
    </>
  )
}