import Header from '@/components/Header'
import React from 'react'

const GroupLayout = ({children}) => {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">
        {children}
      </main>
    </>
  )
}

export default GroupLayout