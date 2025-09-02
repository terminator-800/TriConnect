const NotFoundPage = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-gray-400'>
        <div className='flex justify-center items-center p-15 flex-col border bg-white rounded shadow-lg '>
            <h1>404. That's an error.</h1>
            <p>The requested URL was not found on this server. That’s all we know.</p>
        </div>
    </div>
  )
}

export default NotFoundPage