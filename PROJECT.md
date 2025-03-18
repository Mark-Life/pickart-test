## To Do

1. [x] implement supabase
   1. [x] develop data model
   2. [x] deploy supabase
   3. [x] make basic ui and routing
      1. [x] pickart-next/app/art/[artworkId]/page.tsx
      2. [x] pickart-next/app/place/[slug]/page.tsx
         1. [ ] fix slug to id?
   4. [x] connect via drizzle

2. [ ] User Authentication (Epic 1)
    we use only invitation method via supabase, and admin can sign it
   1. [ ] Setup Supabase Auth with Next.js
   2. [ ] Implement Admin User Management Dashboard
      1. [ ] User Approval System
      2. [ ] User Management Interface

3. [ ] Artwork Management (Epic 2)
   1. [ ] Create Artwork Upload Interface
      1. [ ] Form with all required fields from user stories
      2. [ ] Image upload with Supabase Storage
   2. [ ] Implement Admin Artwork Approval System
   3. [ ] Develop Artwork Search & Filtering

4. [ ] Spot/Property Management (Epic 3)
   1. [ ] Design Property & Spot Data Models in Drizzle
   2. [ ] Create Property Registration Interface
   3. [ ] Develop Spot Creation & Management
      1. [ ] Spot Photo Upload System
      2. [ ] Spot Requirements Specification
   4. [ ] Implement QR Code Generation & Linking

5. [ ] Artwork-Spot Allocation (Epic 4)
   1. [ ] Create Manual Allocation Interface for Admins
   2. [ ] Implement Status Management System
      1. [ ] Artwork Status Workflow
      2. [ ] Spot Status Workflow
   3. [ ] Develop Notification System
      1. [ ] Email Notifications (Artist Delivery Instructions)
      2. [ ] Host Notifications (Artwork Allocation)

6. [ ] Artwork Sales & Checkout (Epic 5)
   1. [ ] Create Artwork Landing Pages
      1. [ ] QR Code Scanning Functionality
      2. [ ] Social Sharing Features
   2. [ ] Implement Stripe Integration
   3. [ ] Develop Delivery Options System
   4. [ ] Create PDF Generation
      1. [ ] Certificate of Authenticity Generator
      2. [ ] Artwork Release Voucher
   5. [ ] Implement Sale Notifications

7. [ ] UI/UX Improvements
   1. [ ] Implement Responsive Design with Tailwind v4
   2. [ ] Create Reusable Components with shadcn/ui
   3. [ ] Optimize for Server-Side Rendering & Caching

8. [ ] Deployment & Testing
   1. [ ] Setup Automated Testing with Typescript
   2. [ ] Configure Vercel Deployment
   3. [ ] Implement Monitoring & Error Tracking