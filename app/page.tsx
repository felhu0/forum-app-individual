import React from 'react'
import ThreadsPage from './(root)/threads/page'

const LandingPage = () => {
  return (
    <>
    <main className='mx-12 my-20'>
      <h1>Welcome to the best forum!</h1>
      <p>Create and discuss threads</p>
      <ThreadsPage />
    </main>
    </>
  )
}

export default LandingPage