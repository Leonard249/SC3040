import Header from '@/components/Header'
import React from 'react'

const HomeLayout = ({children}) => {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">
        {children}
      </main>
    </>
  )
}

export default HomeLayout