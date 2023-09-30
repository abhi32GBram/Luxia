import React from 'react'

const CourseID = ({params} : {
    params:{courseId : string }
}) => {
  return (
    <div>
        CourseID : {params.courseId}
    </div>
  )
}

export default CourseID