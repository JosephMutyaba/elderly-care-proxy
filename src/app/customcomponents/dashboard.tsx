import React from 'react'
import { ModeToggle } from './modetoggle'
import { Button } from '@/components/ui/button'

const Dashboard = (handleLogout:{handleLogout: (e:Event)=>void}) => {
  return (
    <div className='flex-col'>
        <div className='flex justify-center items-center'>
            <div className="flex"></div>
            <div className="flex">
                <ModeToggle/>
                {/* <Button onClick={(e)=>handleLogout()}></Button> */}
            </div>
        </div>
        <div></div>
    </div>
  )
}

export default Dashboard