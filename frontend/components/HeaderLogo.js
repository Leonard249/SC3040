import Link from 'next/link'
import Image from 'next/image'

import React from 'react'

const HeaderLogo = () => {
    return (
        <Link href='/'>
            <div className="items-center hidden lg:flex">
                <Image src="/logo.svg" alt="Logo" height={28} width={28} />
                <p className="font-semibold text-bananaText text-2xl ml-2.5">BananaSplit</p>
            </div>
        </Link>
  )
}

export default HeaderLogo