'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreatePost() {
  const [formData, setFormData] = useState({
    author: '',
    title: '',
    content: '',
    photo: ''
  })
  
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  const formHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)

    try {
      const response = await fetch('/api/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Send the entire formData object
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post")
      }

      setSuccess(true) // Set success state to true if the post is created successfully
      router.push('/') // Navigate back to the homepage after submission
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message) // Set the error message if it's an instance of Error
      } else {
        setError("An unknown error occurred") // Handle unknown error cases
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-8">
      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={formHandler}
        className="border p-2"
      />
      
      <input
        name="author"
        placeholder="Author"
        value={formData.author}
        onChange={formHandler}
        className="border p-2"
      />
      
      <input
        name="photo"
        placeholder="Image URL"
        value={formData.photo}
        onChange={formHandler}
        className="border p-2"
      />
      
      <textarea
        name="content"
        placeholder="Content"
        value={formData.content}
        onChange={formHandler}
        className="border p-2"
      />

      {error && <p className="text-red-500">{error}</p>} {/* Display error message if any */}

      {success && <p className="text-green-500">Post created successfully!</p>} {/* Display success message */}
      
      {/* Button to submit the form */}
      
      <button 
        type="submit" 
        className={`bg-blue-500 text-white px-4 py-2 rounded ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isPending} // Disable button while submitting
      >
        {isPending ? 'Submitting...' : 'Create Post'}
      </button>
    </form>
  )
}
