import React from 'react'
import Sidebar from '../component/Sidebar'
import Addsingleuser from '../component/Addsingleuser'


export default function Adduser() {
  return (
    <div className='admin_dash'>
   <Sidebar/>
   <div className='admin_main_content'>
 <Addsingleuser/>
 </div>
    </div>
  )
}
