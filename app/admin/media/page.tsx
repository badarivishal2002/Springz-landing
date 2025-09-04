"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Image as ImageIcon,
  File,
  Search,
  Filter,
  Trash2,
  Copy,
  Download,
  Eye,
  Grid3X3,
  List,
  Calendar,
  FileText,
  Video,
  Music,
  Archive,
  MoreVertical
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock media data
const mockMediaFiles = [
  {
    id: "1",
    name: "elite-protein-main.jpg",
    type: "image",
    size: "245 KB",
    url: "/api/media/elite-protein-main.jpg",
    uploadedAt: "2024-01-15",
    dimensions: "800x800",
    alt: "Elite Protein Main Product Image"
  },
  {
    id: "2",
    name: "native-protein-classic.jpg",
    type: "image",
    size: "312 KB",
    url: "/api/media/native-protein-classic.jpg",
    uploadedAt: "2024-01-14",
    dimensions: "800x800",
    alt: "Native Protein Classic"
  },
  {
    id: "3",
    name: "nuchhi-nunde-banner.jpg",
    type: "image",
    size: "456 KB",
    url: "/api/media/nuchhi-nunde-banner.jpg",
    uploadedAt: "2024-01-13",
    dimensions: "1200x600",
    alt: "Nuchhi Nunde Banner"
  },
  {
    id: "4",
    name: "product-catalog.pdf",
    type: "document",
    size: "2.3 MB",
    url: "/api/media/product-catalog.pdf",
    uploadedAt: "2024-01-12",
    dimensions: null,
    alt: "Product Catalog PDF"
  },
  {
    id: "5",
    name: "brand-guidelines.pdf",
    type: "document",
    size: "1.8 MB",
    url: "/api/media/brand-guidelines.pdf",
    uploadedAt: "2024-01-10",
    dimensions: null,
    alt: "Brand Guidelines"
  }
]

const fileTypeIcons = {
  image: ImageIcon,
  document: FileText,
  video: Video,
  audio: Music,
  archive: Archive,
  other: File
}

export default function MediaManagementPage() {
  const [files, setFiles] = useState(mockMediaFiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterType, setFilterType] = useState("all")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.alt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || file.type === filterType
    return matchesSearch && matchesType
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    
    // Simulate upload process
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // In a real app, you'd upload to your server here
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newFile = {
        id: Date.now().toString() + i,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        size: `${(file.size / 1024).toFixed(0)} KB`,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString().split('T')[0],
        dimensions: file.type.startsWith('image/') ? "800x800" : null,
        alt: file.name.replace(/\.[^/.]+$/, "")
      }
      
      setFiles(prev => [newFile, ...prev])
    }
    
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
    setSelectedFiles(prev => prev.filter(id => id !== fileId))
  }

  const handleBulkDelete = () => {
    setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)))
    setSelectedFiles([])
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    // In a real app, you'd show a toast notification here
    alert('URL copied to clipboard!')
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const getFileStats = () => {
    const totalFiles = files.length
    const totalSize = files.reduce((acc, file) => {
      const sizeNum = parseFloat(file.size.split(' ')[0])
      const unit = file.size.split(' ')[1]
      return acc + (unit === 'MB' ? sizeNum * 1024 : sizeNum)
    }, 0)
    
    const typeCount = files.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { totalFiles, totalSize: `${(totalSize / 1024).toFixed(1)} MB`, typeCount }
  }

  const stats = getFileStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage images, documents, and other media files</p>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-springz-green hover:bg-springz-green/90"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <File className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-2xl font-bold">{stats.totalFiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ImageIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Images</p>
                <p className="text-2xl font-bold">{stats.typeCount.image || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold">{stats.typeCount.document || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Archive className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Size</p>
                <p className="text-2xl font-bold">{stats.totalSize}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {selectedFiles.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedFiles.length})
            </Button>
          )}
          
          <div className="flex border border-gray-300 rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFiles.map((file) => {
            const FileIcon = fileTypeIcons[file.type as keyof typeof fileTypeIcons] || File
            const isSelected = selectedFiles.includes(file.id)
            
            return (
              <Card key={file.id} className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-springz-green' : ''}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* File Preview */}
                    <div className="relative">
                      <div 
                        className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
                        onClick={() => toggleFileSelection(file.id)}
                      >
                        {file.type === 'image' ? (
                          <img 
                            src={file.url} 
                            alt={file.alt}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileIcon className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-springz-green rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{file.size}</span>
                        <Badge variant="secondary" className="text-xs">
                          {file.type}
                        </Badge>
                      </div>
                      {file.dimensions && (
                        <p className="text-xs text-gray-500">{file.dimensions}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(file.url)}
                        className="flex-1 h-8 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy URL
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(file.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles(filteredFiles.map(f => f.id))
                          } else {
                            setSelectedFiles([])
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-900">Name</th>
                    <th className="p-4 text-sm font-medium text-gray-900">Type</th>
                    <th className="p-4 text-sm font-medium text-gray-900">Size</th>
                    <th className="p-4 text-sm font-medium text-gray-900">Uploaded</th>
                    <th className="p-4 text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => {
                    const FileIcon = fileTypeIcons[file.type as keyof typeof fileTypeIcons] || File
                    const isSelected = selectedFiles.includes(file.id)
                    
                    return (
                      <tr key={file.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleFileSelection(file.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              {file.type === 'image' ? (
                                <img 
                                  src={file.url} 
                                  alt={file.alt}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <FileIcon className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              {file.dimensions && (
                                <p className="text-sm text-gray-500">{file.dimensions}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{file.type}</Badge>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{file.size}</td>
                        <td className="p-4 text-sm text-gray-600">{file.uploadedAt}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(file.url)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(file.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <FileIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-springz-green hover:bg-springz-green/90"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          )}
        </div>
      )}
    </div>
  )
}