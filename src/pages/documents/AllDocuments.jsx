import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const AllDocuments = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch documents logic here
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setDocuments([
        { id: 1, name: 'Sample Document 1', status: 'Draft' },
        { id: 2, name: 'Sample Document 2', status: 'Published' },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Documents</h1>
        <Button>Add New Document</Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p>Loading documents...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 bg-card rounded-lg shadow border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground">Status: {doc.status}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllDocuments