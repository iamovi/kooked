# Kooked Project Visual Map

This document provides a visual overview of the **Kooked** (Roast My Site) codebase and architecture.

## 🏗️ High-Level Architecture

The project is built with **Next.js**, utilizing **Supabase** as the primary backend-as-a-service for data persistence and **TanStack Query** for efficient client-side data fetching.

```mermaid
graph TD
    Client["Next.js Application"]
    Query["TanStack Query"]
    SupaSDK["Supabase Client"]
    SupaCloud["Supabase Cloud (PostgreSQL)"]
    AI["AI Processing (Edge/Server)"]

    Client -->|Manages State| Query
    Query -->|Requests| SupaSDK
    SupaSDK -->|Persists| SupaCloud
    Client -->|Triggers| AI
    AI -->|Stores Result| SupaSDK

    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style SupaCloud fill:#00c4a7,color:#fff,stroke:#333,stroke-width:2px
    style AI fill:#ff9800,color:#fff,stroke:#333,stroke-width:2px
```

---

## 📁 File Structure Map

A clean representation of the project organization, excluding build artifacts and environment-specific files.

```mermaid
graph LR
    Kooked[kooked]
    
    Kooked --> App[app/]
    Kooked --> Src[src/]
    Kooked --> ComponentsJSON[components.json]
    Kooked --> PackageJSON[package.json]
    
    App --> Home[page.tsx]
    App --> Layout[layout.tsx]
    App --> Roast[roast/]
    Roast --> RoastID["[id]/"]
    
    Src --> Components[components/]
    Src --> Hooks[hooks/]
    Src --> Integrations[integrations/]
    Src --> Lib[lib/]
    
    Components --> UI[ui/]
    Components --> RoastCard[RoastCard.tsx]
    Components --> Navbar[Navbar.tsx]
    Components --> History[HistorySidebar.tsx]
    
    Integrations --> Supabase[supabase/]
    Supabase --> SClient[client.ts]
    Supabase --> STypes[types.ts]
    
    Hooks --> UseToast[use-toast.ts]
    
    style App fill:#e1f5fe,stroke:#01579b
    style Src fill:#fff3e0,stroke:#e65100
    style Integrations fill:#e8f5e9,stroke:#1b5e20
```

---

## 🧩 Component Relationships

How the main building blocks of the UI interact.

```mermaid
graph TD
    NAV[Navbar]
    PAGE[Home Page]
    ROASTPAGE[Roast Page]
    SIDE[History Sidebar]
    CARD[Roast Card]
    MODAL[History Modal]
    
    NAV --> SIDE
    PAGE --> CARD
    ROASTPAGE --> CARD
    SIDE --> MODAL
    CARD --> EXPORT[html-to-image Export]
```

---

## 🗄️ Database Schema

The core data model for storing website roasts.

```mermaid
erDiagram
    ROAST_HISTORY {
        uuid id PK "Primary Key"
        string url "Target Website URL"
        string grade "Academic Grade (A, B, F, etc.)"
        string roast_preview "Brief teaser text"
        jsonb full_roasts "Detailed roasting sections"
        string saving_grace "One positive takeaway"
        timestamp created_at "Generation timestamp"
    }
```

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js (App Router) |
| **Styling** | Tailwind CSS + Lucide Icons |
| **UI Components** | Radix UI / Shadcn UI |
| **Data Fetching** | TanStack Query (@tanstack/react-query) |
| **Backend** | Supabase (Database & API) |
| **Export** | html-to-image |
| **Form Management** | React Hook Form + Zod |
