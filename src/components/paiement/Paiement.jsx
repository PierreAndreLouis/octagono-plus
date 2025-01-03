import React from 'react'
// import Navigation_bar from '../home/Navigation_bar'
// import PC_header from '../home/PC_header'
// import Header from '../home/Header'
// import SideBar from '../home/SideBar'

function Paiement() {
  return (
    <div className='flex justify-center mt-10 mb-24 md:mt-24'>
              {/* <Navigation_bar />
              <PC_header />
              <Header  />
              <SideBar  /> */}

        <div className='max-w-[40rem] w-full border-2 border-red-600'>
            <h1 className='text-center mb-10 text-xl text-gray-600'>Choisissez votre mode de paiement</h1>
            <h1 className='text-center mb-10 text-xl text-red-600'>Non disponible pour le moment</h1>
            <div className='flex flex-col gap-4 border'>
                <div className='flex border-2 rounded-xl hover:bg-orange-50/50 border-orange-400/20 justify-between items-center p-3'>
                    <img className='w-12' src="/img/carte/paypal.png" alt="" />
                    <h3 className='text-md text-gray-600 font-semibold'>Paypal</h3>
                </div>

                <div className='flex border-2 rounded-xl hover:bg-orange-50/50 border-orange-400/20 justify-between items-center p-3'>
                    <img className='w-8' src="/img/carte/mastercard.png" alt="" />
                    <h3 className='text-md text-gray-600 font-semibold'>Master Card</h3>
                </div>

                <div className='flex border-2 rounded-xl hover:bg-orange-50/50 border-orange-400/20 justify-between items-center p-3'>
                    <img className='w-8' src="/img/carte/moncash.png" alt="" />
                    <h3 className='text-md text-gray-600 font-semibold'>Mon Cash</h3>
                </div>

                <div className='flex border-2 rounded-xl hover:bg-orange-50/50 border-orange-400/20 justify-between items-center p-3'>
                    <img className='w-8' src="/img/carte/visa.png" alt="" />
                    <h3 className='text-md text-gray-600 font-semibold'>Visa</h3>
                </div>

                <div className='flex justify-center mt-8'>
                    <button className='bg-orange-500 px-4 w-full py-2 rounded-xl text-white font-semibold cursor-pointer'>Continuer</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Paiement