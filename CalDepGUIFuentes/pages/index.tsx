import Image from 'next/image'
import { Inter } from 'next/font/google'
import TresColumnas from '@/components/TresColumnas';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="App">
      <TresColumnas />
    </div>
  )
}
