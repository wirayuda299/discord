'use client' // Error components must be Client Components

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center text-white'>

      <div className='mx-auto max-w-screen-sm flex flex-col items-center'>
        <h1 className='text-3xl text-center text-red-600 text-balance'>
          {error.message}
        </h1>
        <Link className='border rounded-sm text-center block mt-5 w-28 py-1' href={'/direct-messages'}>
          Back
        </Link>
      </div>
    </div>
  )
}
