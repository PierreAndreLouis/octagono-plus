import React from 'react'

function LoadingPageEffectCircle({getAllAccountsDataLoading}) {
  return (
    <div>{getAllAccountsDataLoading && (
        <div className="fixed z-30 inset-0 bg-gray-200/50 dark:bg-black/50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="border-blue-500 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-100/0" />
          </div>
        </div>
      )}</div>
  )
}

export default LoadingPageEffectCircle