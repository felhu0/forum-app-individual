import React from 'react'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            RootLayout
            {children}
        </div>
    )
}

export default RootLayout