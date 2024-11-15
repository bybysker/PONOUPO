# PONOUPO - AI-Powered Document Analysis Platform

## Overview
PONOUPO is an intelligent document analysis platform that combines modern web technologies with advanced AI capabilities to provide powerful document processing and question-answering features. ONLY PDF FILES ARE SUPPORTED FOR NOW.

## 🌟 Key Features

### Document Management
- Secure document upload and storage
- Multiple file format support (PDF, DOCX, TXT)
- Document version control
- Organized file categorization

### AI Capabilities
- RAG (Retrieval Augmented Generation) for accurate responses
- Context-aware document analysis
- Natural language querying
- Source-backed answers

### Security
- User authentication and authorization
- Secure document storage
- Data encryption
- Role-based access control

## 🏗️ Architecture

### Frontend (Next.js)
- Modern React-based web application
- TypeScript for type safety
- Responsive design with Tailwind CSS
- Component library with shadcn/ui

### Backend (FastAPI)
- High-performance Python API
- Async request handling
- OpenAI integration
- Vector database for document embeddings

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn
- Docker (optional)

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/ponoupo.git
cd ponoupo
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Configuration**

Backend (.env):
```env
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_pinecone_env
DATABASE_URL=your_database_url
```

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_CONFIG=your_firebase_config
```

### Running the Application

1. **Start Backend**
```bash
cd backend
uvicorn api.main:app --reload
```

2. **Start Frontend**
```bash
cd frontend
npm run dev
```

## 🛠️ Development

### Backend Structure
```
backend/
├── api/
│   ├── main.py
│   ├── rag.py
│   └── routes/
├── models/
├── services/
└── tests/
```

### Frontend Structure
```
frontend/
├── app/
├── components/
├── lib/
└── public/
```

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs)
- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.