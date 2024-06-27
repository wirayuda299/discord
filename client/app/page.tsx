import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-static';

export default function Home() {
  return (
    <div className=" min-h-dvh  md:min-h-screen max-h-screen w-full bg-gradient-to-b from-blue-800 to-blue-500 select-none overflow-y-auto no-scrollbar">
      <div className=" px-4 md:px-8 bg-cover bg-fixed max-w-screen-2xl  mx-auto bg-[url('/general/images/stars.webp')]">
        <header className="min-h-20 gap-3 sticky top-0 justify-between flex-center text-white">
          <div>
            <Link className="flex-center gap-3" href={'/'}>
              <Image className="rounded-lg object-contain aspect-auto" src={'/general/icons/logo.svg'} width={45} height={45} alt="logo" />
              <h2 className="font-bold  text-2xl hidden md:block">ChatFuzion</h2>

            </Link>
          </div>
          <Link className="w-24 bg-white font-semibold h-10 text-sm rounded-full text-black text-center flex-center justify-center" href={'/direct-messages'}>
            Start Chat
          </Link>
        </header>

        <section className="grid min-[1200px]:grid-cols-2 text-white gap-5 justify-center items-center  no-scrollbar mx-auto ">
          <div className="max-w-[500px] flex flex-col gap-3">
            <h1 className="md:text-5xl  text-3xl text-balance font-extrabold pb-2 to-white ">
              Bringing People Together Through Fun and Interactive Chats
            </h1>
            <p className="text-sm md:text-base text-white">
              Our platform is perfect for engaging in group chats and video calls with friends or building a global community. Customize your own space to talk, connect, and hang out in real-time </p>
          </div>

          <Image
            priority
            fetchPriority="high"
            className="object-contain min-w-full  aspect-auto object-center"
            sizes="400px"
            src='/general/images/banner.png'
            width={400}
            height={400}
            alt="mockup" />

        </section>

      </div >
    </div >
  )
}
