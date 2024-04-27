import Friends from "@/components/friends"

type AllowedSearchParamsType = 'friends' | 'shop' | 'nitro' 

type Props = {
  searchParams: {
    menu:AllowedSearchParamsType
  }
}

function isAllowedSearchParams(params:Readonly<AllowedSearchParamsType>) {
  const allowedSearchParams = ['friends', 'shop', 'nitro'] as const
  return allowedSearchParams.includes(params)
}

export default function DirectMessages({searchParams}:Props) {
  
  if (searchParams.menu && !isAllowedSearchParams(searchParams.menu)) return null

  if (searchParams.menu === 'friends') return <Friends/>
  

}
