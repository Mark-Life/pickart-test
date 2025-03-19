# PickArt


## 🚀 Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Static type checking
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- [Supabase](https://supabase.io/) - Open source Firebase alternative

## 📋 Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pickart-next
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the root directory and add necessary environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📦 Project Structure

```
pickart-next/
├── app/                    # App router directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── lib/               # Utility functions and shared logic
│   └── styles/            # Global styles
├── public/                # Static files
├── types/                 # TypeScript type definitions
└── tests/                 # Test files
```

## 🔄 Supabase Webhook Setup

To enable secure, real-time updates on art pages when database changes occur:

### 1. Generate a Webhook Secret

Create a secure random secret that will be used to verify webhook authenticity:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save the generated value for the next steps.

### 2. Configure Environment Variables

Add the webhook secret to your environment:

```
# .env.local for development
SUPABASE_WEBHOOK_SECRET=your_generated_webhook_secret
# Optional: Skip verification during development
SKIP_WEBHOOK_VERIFICATION=true
```

For production, add the secret to your hosting provider's environment variables (Vercel, Netlify, etc.).

### 3. Create the Webhook in Supabase

1. Go to your Supabase dashboard
2. Navigate to `Database` > `Webhooks`
3. Create a new webhook with the following settings:
   - **Name**: `ArtworkUpdates`
   - **Table**: `artworks`
   - **Events**: Check `INSERT`, `UPDATE`, and `DELETE`
   - **HTTP Method**: `POST`
   - **URL**: `https://your-domain.com/api/webhook/supabase`
   - **Headers**: Add `x-supabase-signature` with your webhook secret

### 4. Create a Database Function for Signing (Optional)

If you want to create webhooks from your database, use this function:

```sql
CREATE OR REPLACE FUNCTION public.signed_webhook(webhook_url TEXT, payload JSONB) 
RETURNS VOID SECURITY DEFINER AS $$
DECLARE
  secret_key TEXT;
  headers_json JSONB;
  payload_text TEXT;
BEGIN
  -- Get the secret key from vault or environment variable
  SELECT decrypted_secret INTO secret_key 
  FROM vault.decrypted_secrets 
  WHERE name = 'webhook_secret_key' 
  LIMIT 1;
  
  -- Convert payload to TEXT
  payload_text := payload::TEXT;
  
  -- Generate signature using HMAC SHA-256
  headers_json := jsonb_build_object(
    'x-supabase-signature', 
    encode(hmac(payload_text, secret_key, 'sha256'), 'hex'),
    'Content-Type', 'application/json'
  );
  
  -- Call the webhook
  PERFORM net.http_post(
    url := webhook_url,
    body := payload,
    headers := headers_json
  );
END;
$$ LANGUAGE plpgsql;
```

### 5. Testing the Webhook

To test locally with development server:

```bash
curl -X POST http://localhost:3000/api/webhook/supabase \
  -H "Content-Type: application/json" \
  -H "x-supabase-signature: your_webhook_secret_for_testing" \
  -d '{"table":"artworks","type":"UPDATE","record":{"artwork_id":"AWCH-12345"}}'
```

When changes are made to the `artworks` table, the webhook will trigger revalidation of the related art pages, ensuring they always display the most up-to-date information.

### Security Notes

- The webhook implementation uses HMAC-SHA256 for signature verification
- Timing-safe comparison is used to prevent timing attacks
- In production, never log or expose your webhook secret

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

## 🚀 Deployment

The application can be deployed using [Vercel](https://vercel.com) or any other hosting platform that supports Next.js applications.

```bash
pnpm build
```

## 🔧 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- All contributors who participate in this project