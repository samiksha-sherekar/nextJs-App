# Supabase Edge Function Development Guide

## Current Status
✅ Your Supabase edge function `hello` is configured and ready to deploy
✅ Supabase containers are starting up (this may take a few minutes)

## Your Edge Function

**Location**: `supabase/functions/hello/index.ts`

```typescript
import { serve } from "https://deno.land/std/http/server.ts";

serve(() => {
  return new Response(
    JSON.stringify({ message: "Hello from Supabase Edge Function 👋" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});
```

## Once Supabase is Running

### 1. Deploy Your Edge Function
```bash
npx supabase functions deploy hello
```

### 2. Test Your Function
```bash
# Test the deployed function
curl http://localhost:54321/functions/v1/hello

# Or use the test script
node test-supabase-setup.js
```

### 3. Expected Response
```json
{
  "message": "Hello from Supabase Edge Function 👋"
}
```

## Development Workflow

### Making Changes to Your Function
1. Edit `supabase/functions/hello/index.ts`
2. Redeploy: `npx supabase functions deploy hello`
3. Test: `curl http://localhost:54321/functions/v1/hello`

### Function URLs
- **Local Development**: `http://localhost:54321/functions/v1/hello`
- **Production**: `https://<project-ref>.supabase.co/functions/v1/hello`

## Next Steps

### 1. Enhance Your Function
You can modify your function to:
- Accept query parameters
- Process POST requests
- Connect to your Supabase database
- Use environment variables

### 2. Example: Enhanced Function
```typescript
import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  const name = url.searchParams.get('name') || 'World';
  
  return new Response(
    JSON.stringify({ 
      message: `Hello ${name} from Supabase Edge Function!`,
      timestamp: new Date().toISOString()
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});
```

### 3. Test with Parameters
```bash
curl "http://localhost:54321/functions/v1/hello?name=Samiksha"
```

## Useful Commands

```bash
# Check Supabase status
npx supabase status

# List all functions
npx supabase functions list

# Deploy a specific function
npx supabase functions deploy hello

# Remove a function
npx supabase functions delete hello

# View function logs
npx supabase functions logs hello

# Open Supabase Studio (web interface)
npx supabase studio
```

## Integration with Your Next.js App

Once your function is deployed, you can call it from your React components:

```javascript
// In your React component
const callEdgeFunction = async () => {
  try {
    const response = await fetch('/functions/v1/hello');
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error('Error calling function:', error);
  }
};
```

## Troubleshooting

### Function Not Found
- Make sure the function is deployed: `npx supabase functions deploy hello`
- Check the function name matches exactly

### CORS Issues
- Supabase handles CORS automatically for local development
- For production, configure CORS in your Supabase dashboard

### Environment Variables
- Use `Deno.env.get('VARIABLE_NAME')` in your function
- Set variables in Supabase dashboard or `.env` file

## Next Steps for Your Project

1. **Database Integration**: Connect your function to your Supabase database
2. **Authentication**: Use Supabase auth in your functions
3. **Multiple Functions**: Create additional functions for different purposes
4. **Production Deployment**: Deploy to Supabase cloud when ready

## Getting Help

- Supabase Documentation: https://supabase.com/docs
- Edge Functions Guide: https://supabase.com/docs/guides/functions
- Deno Runtime: https://deno.com/runtime

---

**Note**: Your Supabase containers are currently starting up. Once they're ready, you can deploy and test your function using the commands above!