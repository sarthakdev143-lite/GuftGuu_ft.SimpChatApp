import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <section className='flex flex-col gap-4 -mt-[10%]'>
        <Link href='/private' className='flex gap-3 bg-green-500 px-8 py-3 text-xl rounded hover:bg-green-600 transition'>
          <i class="ri-lock-line"></i><span>Private Chat.</span>
        </Link>
        <Link href='/world' className='flex gap-3 bg-blue-500 px-8 py-3 text-xl rounded hover:bg-blue-600 transition'>
          <i class="ri-group-line"></i><span>World Chat.</span>
        </Link>
      </section>
    </div>
  );
}