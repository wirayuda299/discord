import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-static';

export default function Home() {
  return (
    <div className=" min-h-dvh  md:min-h-screen w-full bg-gradient-to-b from-blue-800 to-blue-500 select-none ">
      <div className=" px-4 md:px-8 max-w-screen-2xl bg-cover bg-fixed  mx-auto bg-[url('/general/images/stars.webp')]">
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

        <section className="grid max-lg:grid-cols-1 grid-cols-2 text-white gap-5 justify-center items-center min-h-[calc(100vh-100px)] mx-auto pt-5 ">
          <div className="max-w-[520px] flex flex-col gap-3">
            <h1 className="md:text-6xl  text-3xl text-balance font-extrabold pb-2 to-white ">
              Bringing People Together Through Fun and Interactive Chats
            </h1>
            <p className="text-sm md:text-base text-white">
              Our platform is perfect for engaging in group chats and video calls with friends or building a global community. Customize your own space to talk, connect, and hang out in real-time </p>
          </div>


          <Image priority fetchPriority="high" className="object-cover aspect-auto object-center h-full" sizes="700px" src='/general/images/mockup.png' width={700} height={700} alt="mockup" />
        </section>

      </div>
    </div>
  )
}
