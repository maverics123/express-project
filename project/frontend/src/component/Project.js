import React from 'react'
import Assigneduser from './Assigneduser'

export default function Project(props) {
  return (
    <div className='single_project_card'>
        <h1>{props.project.title}</h1>
        <p>{props.project.description}</p>
        <div>Assigned to:<Assigneduser project_id={props.project._id} assigneduser={props.project.assignedUsers}/></div>
    </div>
  )
}
