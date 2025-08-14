# Document Upload and Retrieval System

## Overview

The HakiChain platform now includes a comprehensive document management system that enables users to upload documents directly to "My Haki Docs" and seamlessly retrieve files between different Haki Tools. This system provides a unified document storage and retrieval experience across the entire platform.

## Features Implemented

### 1. Document Upload System
- **Direct Upload**: Users can upload files directly to their Haki Docs
- **Drag & Drop Support**: Modern drag-and-drop interface for easy file uploads
- **Progress Tracking**: Real-time upload progress with visual feedback
- **File Validation**: Automatic file type and size validation
- **Multiple File Support**: Upload multiple files simultaneously
- **Error Handling**: Comprehensive error handling and user feedback

### 2. Document Retrieval System
- **Cross-Tool Access**: Retrieve documents from Haki Docs in any tool
- **Search & Filter**: Advanced search and filtering capabilities
- **Document Preview**: Visual preview of selected documents
- **Bulk Selection**: Select multiple documents at once
- **Context-Aware Filtering**: Filter documents by type, case, or milestone

### 3. Integration Components
- **Reusable Components**: Modular components for easy integration
- **Consistent UI**: Unified design language across all tools
- **Accessibility**: Full accessibility support with ARIA labels
- **Responsive Design**: Works seamlessly on all device sizes

## Components Created

### 1. DocumentUpload Component
**Location**: `src/components/common/DocumentUpload.tsx`

**Features**:
- Drag and drop file upload
- Progress tracking
- File validation
- Preview of uploaded files
- Error handling

**Usage**:
```tsx
import { DocumentUpload } from '../../components/common/DocumentUpload';

<DocumentUpload
  onUploadComplete={(documents) => console.log('Uploaded:', documents)}
  onUploadError={(error) => console.error('Error:', error)}
  multiple={true}
  acceptedTypes={['application/pdf', 'image/*']}
  maxSize={50 * 1024 * 1024} // 50MB
  showPreview={true}
  placeholder="Upload your documents"
  bountyId="optional-bounty-id"
  milestoneId="optional-milestone-id"
/>
```

### 2. DocumentSelector Component
**Location**: `src/components/common/DocumentSelector.tsx`

**Features**:
- Browse existing documents
- Search and filter functionality
- Multiple document selection
- Preview of selected documents
- Modal-based interface

**Usage**:
```tsx
import { DocumentSelector } from '../../components/common/DocumentSelector';

<DocumentSelector
  onDocumentSelect={(documents) => console.log('Selected:', documents)}
  multiple={true}
  selectedDocuments={[]}
  showPreview={true}
  placeholder="Select documents from Haki Docs"
  filterByType={['application/pdf']}
  maxSelect={5}
/>
```

### 3. useDocumentManagement Hook
**Location**: `src/hooks/useDocumentManagement.ts`

**Features**:
- Complete document CRUD operations
- Search and filtering
- Upload with progress tracking
- Download functionality
- Error handling

**Usage**:
```tsx
import { useDocumentManagement } from '../../hooks/useDocumentManagement';

const {
  documents,
  isLoading,
  error,
  loadDocuments,
  uploadDocuments,
  deleteDocument,
  downloadDocument,
  searchDocuments,
  updateDocument
} = useDocumentManagement();
```

### 4. DocumentIntegrationExample Component
**Location**: `src/components/common/DocumentIntegrationExample.tsx`

**Features**:
- Complete integration example
- Upload and retrieval in one component
- Document management interface
- Configurable limits and types

**Usage**:
```tsx
import { DocumentIntegrationExample } from '../../components/common/DocumentIntegrationExample';

<DocumentIntegrationExample
  title="Case Documents"
  description="Upload or select documents for this case"
  onDocumentsChange={(documents) => setCaseDocuments(documents)}
  maxDocuments={10}
  acceptedTypes={['application/pdf', 'image/*', 'application/msword']}
/>
```

## Updated Pages

### 1. LawyerDocuments Page
**Location**: `src/pages/lawyer/LawyerDocuments.tsx`

**Enhancements**:
- Integrated new upload and selector components
- Enhanced search and filtering
- Improved document management interface
- Modal-based upload and selection
- Better error handling and user feedback

### 2. LawyerAI Page
**Location**: `src/pages/lawyer/LawyerAI.tsx`

**Enhancements**:
- Added document integration capabilities
- Import statements for document components
- State management for document selection

## Database Schema

The document system uses the existing `documents` table with the following structure:

```sql
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  path text NOT NULL,
  uploaded_by uuid REFERENCES users(id) NOT NULL,
  bounty_id uuid REFERENCES bounties(id),
  milestone_id uuid REFERENCES milestones(id),
  size bigint NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Storage

Documents are stored in Supabase Storage with the following structure:
- **Bucket**: `documents`
- **Path**: `{user_id}/{timestamp}_{random}.{extension}`
- **Access**: Public URLs for easy retrieval

## Security Features

### Row Level Security (RLS)
- Users can only access their own documents
- Documents are accessible to users involved in related bounties
- Proper authentication checks on all operations

### File Validation
- File type validation
- File size limits (configurable)
- Secure file naming
- Virus scanning (if configured)

## Integration Guide

### Adding Document Upload to a New Tool

1. **Import Components**:
```tsx
import { DocumentUpload } from '../../components/common/DocumentUpload';
import { DocumentSelector } from '../../components/common/DocumentSelector';
import { useDocumentManagement } from '../../hooks/useDocumentManagement';
```

2. **Add State Management**:
```tsx
const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
const [showUploadModal, setShowUploadModal] = useState(false);
const [showSelectorModal, setShowSelectorModal] = useState(false);
```

3. **Add Event Handlers**:
```tsx
const handleUploadComplete = (uploadedDocs: Document[]) => {
  setShowUploadModal(false);
  setSelectedDocuments(prev => [...prev, ...uploadedDocs]);
};

const handleDocumentSelect = (selectedDocs: Document[]) => {
  setShowSelectorModal(false);
  setSelectedDocuments(prev => [...prev, ...selectedDocs]);
};
```

4. **Add UI Components**:
```tsx
<div className="flex gap-2">
  <button onClick={() => setShowUploadModal(true)}>
    Upload Files
  </button>
  <button onClick={() => setShowSelectorModal(true)}>
    Select from HakiDocs
  </button>
</div>
```

5. **Add Modals**:
```tsx
{showUploadModal && (
  <div className="modal">
    <DocumentUpload
      onUploadComplete={handleUploadComplete}
      onUploadError={(error) => alert(error)}
    />
  </div>
)}

{showSelectorModal && (
  <div className="modal">
    <DocumentSelector
      onDocumentSelect={handleDocumentSelect}
    />
  </div>
)}
```

## Best Practices

### 1. File Management
- Always validate file types and sizes
- Provide clear error messages
- Show upload progress for better UX
- Handle network errors gracefully

### 2. User Experience
- Use consistent terminology ("Haki Docs")
- Provide clear visual feedback
- Include helpful placeholder text
- Support keyboard navigation

### 3. Performance
- Implement lazy loading for large document lists
- Use pagination for better performance
- Optimize image previews
- Cache frequently accessed documents

### 4. Security
- Validate all file uploads
- Sanitize file names
- Implement proper access controls
- Log all document operations

## Troubleshooting

### Common Issues

1. **Upload Fails**:
   - Check file size limits
   - Verify file type restrictions
   - Ensure user is authenticated
   - Check network connectivity

2. **Documents Not Loading**:
   - Verify user permissions
   - Check database connection
   - Ensure proper error handling
   - Validate user authentication

3. **Selector Not Working**:
   - Check if documents exist
   - Verify user has access
   - Ensure proper state management
   - Check for JavaScript errors

### Debug Tips

1. **Check Console Logs**: Look for error messages in browser console
2. **Verify Network Requests**: Check Network tab for failed requests
3. **Test Authentication**: Ensure user is properly logged in
4. **Check Database**: Verify documents exist in database
5. **Test Storage**: Ensure files are properly stored in Supabase

## Future Enhancements

### Planned Features
1. **Document Versioning**: Track document versions and changes
2. **Collaborative Editing**: Real-time document collaboration
3. **Advanced Search**: Full-text search within documents
4. **Document Templates**: Pre-built document templates
5. **OCR Integration**: Extract text from scanned documents
6. **Digital Signatures**: Built-in digital signature support
7. **Document Workflows**: Automated document approval processes
8. **Integration APIs**: External system integrations

### Performance Improvements
1. **Caching**: Implement document caching for faster access
2. **Compression**: Automatic file compression for storage optimization
3. **CDN**: Use CDN for faster document delivery
4. **Lazy Loading**: Implement lazy loading for document previews
5. **Background Processing**: Process documents in background

## Support

For technical support or questions about the document system:

1. **Documentation**: Check this guide and inline code comments
2. **Code Examples**: Review the integration example component
3. **Database**: Check the migration files for schema details
4. **Components**: Review the component source code for implementation details

## Conclusion

The document upload and retrieval system provides a robust foundation for document management across the HakiChain platform. With its modular design, comprehensive features, and easy integration, it enables seamless document workflows for all users while maintaining security and performance standards.
