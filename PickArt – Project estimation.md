# Tech Estimate

## Overview

This document outlines the technical stack and architecture for the PickArt platform, an online marketplace connecting artists with property owners and their guests for artwork display and sales.

## Technical Stack

|  | Option 1 | Option 2 |
| :---- | :---- | :---- |
| Framework | Next.js | Vue.js \+ nuxt |
| Hosting | Vercel1 TB /month included then starting at $0.15 per GB | FirebaseNo cost up to 5GB/month Then $0.20/GB |
| Functions/compute | Vercel Functions 1,000 GB-hour /month included then $0.18 per GB-hour | Cloud Funcions GB-seconds: 400K/month included [then google cloud price](https://cloud.google.com/run/pricing) |
| Database | PostgreSQL – Supabase (server-saas) 8 GB disk size per project included then $0.125 per GB | Document – Firebase Storage (serverless)No cost up to 5GB/month Then $0.10/GB |
| Auth | Supabase Auth100,000 included then $0.00325 per MAU | Firebase Auth No-cost up to 50k MAUs then $0.0055 per MAU |
| CDN | Supabase Storage 100gb included then $0.021 per GB | Google Cloud CDN  ? |
| Image Optimization | Vercel: 10k imgs / monthThen [$0.05 \- $0.0812 per 1K](https://vercel.com/docs/pricing/regional-pricing#specific-region-pricing) | ? |
| Monthly min pay | Total: $45Vercel: $20 Supabase: $25 |  |

### Frontend Stack

#### Core Framework

\- **Next.js 15** (App Router)  
 \- Server-side rendering (SSR) for dynamic content  
 \- Static site generation (SSG) for artwork pages  
 \- React Server Components  
 \- Built-in API routes  
 \- Automatic static optimization

#### UI Layer

\- **Styling & Components**  
 \- Tailwind CSS for utility-first styling  
 \- Shadcn/ui for pre-built components  
 \- Framer Motion for animations and transitions

#### State Management & Data Fetching

\- TanStack Query for server state management  
\- Zustand for client-side state  
\- SWR for real-time data updates

### Backend Stack

#### API Layer (serverless)

\- Next.js API routes for basic operations  
\- tRPC for type-safe API communication

#### Database (server–saas)

\- PostgreSQL as the main database  
\- Drizzle ORM for type-safe database access  
\- Supabase platform:  
 \- Built-in authentication  
 \- Real-time subscriptions  
 \- Row-level security  
 \- Storage solutions  
 \- Database management and monitoring dashboard

#### Authentication System

##### Primary Option: Supabase Auth

\- Built-in authentication service:  
 \- Multiple auth providers (OAuth, Magic Link, Phone)  
 \- User management dashboard  
 \- Row-level security (RLS)  
 \- Custom claims and roles  
 \- JWT token management  
 \- Deep PostgreSQL integration  
 \- Real-time subscriptions support

##### Alternative Option: Clerk.com

\- Complete user management platform:  
 \- Authentication flows (OAuth, passwordless, 2FA)  
 \- User profiles and management  
 \- Role-based access control (RBAC)  
   \- Admin  
   \- Artist  
   \- Host  
   \- Guest  
 \- Organization management  
 \- Pre-built UI components  
 \- JWT session management  
 \- Enterprise SSO

#### File Storage & CDN

##### Option 1

\- **UploadThing** for image and file uploads:  
 \- Secure file upload handling  
 \- Type-safe file router  
 \- Automatic image optimization

##### Option 2

\- **Supabase Store**  
 \- Secure file upload handling  
 \- Built-in authentication integration  
 \- CDN

### Payment Processing

#### Primary Option: Stripe

\- Direct payment processing  
\- Connect accounts for revenue sharing  
\- Built-in tax management  
\- Subscription handling

#### Alternative Option: Paddle

\- Merchant of record service  
\- Global tax handling  
\- Revenue sharing capabilities  
\- Simplified compliance

### DevOps & Infrastructure

#### Hosting & Deployment

\- Vercel for Next.js deployment  
\- Automated scaling

#### CI/CD Pipeline

\- GitHub Actions for automation  
\- Automated testing  
\- Deployment workflows

#### Monitoring & Analytics

\- **PostHog** for comprehensive analytics:  
 \- User behavior tracking  
 \- Event-based analytics  
 \- Session replay  
 \- Feature flags  
 \- Funnel analysis  
 \- User cohorts  
 \- Self-hosted option available  
 \- GDPR compliant

### Additional Tools & Libraries

#### SEO & Performance

\- Next-SEO for metadata management  
\- Schema.org markup implementation  
\- Automated sitemap generation  
\- Search engine submission APIs

#### QR Code System

\- QRCode.react for dynamic generation  
\- Custom URL scheme  
\- Analytics tracking

#### Type Safety & Validation

\- TypeScript for static typing  
\- Zod for runtime validation  
\- tRPC for API type safety

#### Development Tooling

\- ESLint for code linting  
\- Prettier for code formatting

## Implementation Workflow

### Artwork Page Generation Process

1\. **Approval Trigger**  
  \- Artwork approval completion  
  \- Metadata validation  
  \- Asset verification

2\. **Page Generation**  
  \- Unique slug/URL creation  
  \- Static page generation (ISR)  
  \- Metadata compilation  
  \- Schema.org markup generation

3\. **SEO Optimization**  
  \- Image optimization  
  \- Alt text generation  
  \- Structured data implementation  
  \- Social media meta tags  
  \- Rich snippets preparation

4\. **Publication**  
  \- Static asset deployment  
  \- Search engine notification  
  \- Sitemap update

## Phase-wise Implementation

### Phase 0 (MVP)

\- Basic Next.js setup with SSR  
\- Core authentication  
\- Basic artwork management  
\- Simple spot allocation  
\- Initial payment integration  
\- Basic SEO implementation

### Phase 1

\- Enhanced user roles  
\- Advanced artwork management  
\- Automated approval workflows  
\- Revenue sharing implementation  
\- Advanced analytics  
\- Expanded SEO features

### Phase 2

\- Platform optimization  
\- Advanced analytics  
\- Enhanced user experiences  
\- Platform scaling features  
\- Additional payment options  
\- Advanced SEO optimization

## Security Considerations

\- JWT token management  
\- RBAC implementation  
\- Payment security  
\- File upload validation

## Performance Optimization

\- Image optimization  
\- Caching strategies  
\- Database indexing  
\- Query optimization

## Monitoring & Maintenance

\- Error Tracking  
\- Performance monitoring  
\- User analytics  
\- Database monitoring  
\- Security monitoring  
\- Backup strategies

## Cost Estimate

### Infrastructure (Monthly Costs)

#### Essential Services

1\. **Vercel (Hosting & Deployment)** [Pricing](https://vercel.com/pricing)  
  \- Hobby: $0/month (Free tier)  
  \- Pro: $20/month (Recommended for production)  
  \- Scale pricing based on usage

2\. **Supabase (Database & Auth)** [Pricing](https://supabase.com/pricing)  
  \- Free tier: $0/month  
  \- Pro: $25/month  
  \- Includes:  
    \- Database hosting  
    \- Auth services  
    \- Real-time subscriptions  
    \- 8GB database space (note: db does not store the image and QR assets)  
    \- Daily backups

3\. **UploadThing (File Storage)** [Pricing](https://uploadthing.com/)  
  \- Free tier: $0/month (2GB storage)  
  \- Pro: $10/month (100GB storage)  
  \- Additional storage: $0.08/GB

4\. **Stripe (Payment Processing)**  
  \- No monthly fee  
  \- Transaction fees: 2.9% \+ $0.30 per successful charge  
  \- Additional fees for international transactions

5\. **PostHog (Analytics)** [Pricing](https://posthog.com/pricing)  
  \- Free tier: Up to 1M events/month  
  \- Growth: Starts at $45/month  
  \- Price per event after free tier: $0.00045

#### Optional/Alternative Services

1\. **Clerk (Auth) \- If chosen over Supabase Auth** [Pricing](https://clerk.com/pricing)  
  \- Free tier: Up to 5,000 MAU  
  \- Starter: $25/month (up to 10,000 MAU)

2\. **Paddle (Payment) \- If chosen over Stripe**  
  \- No base fee  
  \- Transaction fees: 5-7% \+ fixed fee per transaction  
  \- Includes tax handling

### Estimated Monthly Infrastructure Costs

\- **MVP Phase**: $25-45/month  
 \- Vercel Pro: Free tier / $20  
 \- Supabase Pro: $25  
 \- UploadThing: Free tier  
 \- Stripe: Transaction-based  
 \- PostHog: Free tier

\- **Growth Phase**: $80-160/month  
 \- Vercel Pro: $20  
 \- Supabase Pro: $40  
 \- UploadThing: $10  
 \- Stripe: Transaction-based  
 \- PostHog: $10  
 \- Actual cost will depend on traffic and transaction volume

### Development Time Estimate

**Note:** This estimate accounts for Phase 0 (MVP) only. Future phases are not estimated as the product development direction may significantly change based on MVP feedback and market validation. This approach allows for more accurate planning and better resource allocation based on real user data and business needs.

#### Phase 0 (MVP) \- Estimated 60-80 hours

1\. **Setup & Infrastructure** (8-10 hours)  
  \- Next.js project setup with TypeScript  
  \- Supabase integration (auth & database)  
  \- Basic CI/CD setup  
  \- Essential schema design

2\. **Core Features** (30-40 hours)  
  \- Role-based access control implementation (10-15 hours)  
    \- Permission management  
    \- Secure routes and API endpoints  
  \- Simple artwork upload (UploadThing)  
  \- Basic artwork listing and detail pages  
  \- Simple admin approval flow  
  \- Basic QR code generation  
  \- Minimal payment integration (Stripe)

3\. **Frontend Development** (16-20 hours)  
  \- Essential pages only  
  \- Basic responsive design  
  \- Minimal but clean UI

4\. **Testing, Launch, Documentation** (6-10 hours)  
  \- Basic testing  
  \- Initial deployment  
  \- Critical bug fixes  
  \- Role-based access testing  
  \- Documentation

**Note:** In case of drastic hour spending changes in phase 0 stages, the client will be notified and we will make a common decision on pivoting / dropping features or other possible actions to prevent expanding cost and time to MVP delivery.

### Development cost

\- **Rate:** $35/h  
\- **MVP Development:** $2,100 \- $2,800

## MVP Deliverables & Assets

### 1\. Source Code & Documentation

\- Private GitHub repository with:  
 \- Complete source code with TypeScript  
 \- README.md and project documentation  
 \- Development setup guide  
 \- Deployment instructions  
 \- API documentation  
 \- Environment variables template  
 \- Database schema documentation

### 2\. Infrastructure & Services

\- Configured and connected accounts for:  
 \- Vercel (deployment platform)  
 \- Supabase (database & auth)  
 \- UploadThing (file storage)  
 \- Stripe (payment processing)  
 \- PostHog (analytics)  
\- All necessary API keys and configurations  
\- Development and production environments

### 3\. Functional Components

\- **Authentication System**  
 \- Multi-role user system (Admin and no-role only, artist and host roles – part of phase 1\)  
 \- Login/Register flows  
 \- Role-based access control

\- **Artwork Management**  
 \- Artwork upload system  
 \- Admin approval dashboard  
 \- Public artwork gallery  
 \- Individual artwork pages (SSG)  
 \- QR code generation system

\- **Payment System**  
 \- Stripe integration  
 \- Basic checkout flow  
 \- Transaction history will be a part of Stripe dashboard and not be implemented in the app for phase 0

### 4\. Administrative Tools

\- Admin dashboard with:  
 \- Artwork approval system  
 \- Basic analytics  
 \- Content management

### 5\. Frontend Assets

\- Responsive design for all pages  
\- Mobile-friendly interface  
\- Optimized images and assets  
\- SEO-ready page templates

### 6\. Security

\- Role Based Access  
\- JWT authentication setup  
\- Secure file upload system  
\- Payment security implementation

### 7\. Documentation & Training

\- System architecture documentation  
\- API endpoints documentation  
\- User manual for admin dashboard  
\- Deployment workflow documentation

### 8\. Handover Package

\- Access to all connected services  
\- List of all credentials and access points  
\- Future development plan  
\- Known limitations documentation

---

### Additional

1. vue.js on versel: [https://vercel.com/templates/vue/vue](https://vercel.com/templates/vue/vue)

### ToDo:

- [ ] Supabase to PoS  
- [ ] Github read  
- [ ] figma