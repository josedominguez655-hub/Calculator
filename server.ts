import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Global CORS and PWA static headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });

  // Dedicated routes for PWA Manifest and Service Worker with optimal MIME types
  app.get(['/manifest.json', '/manifest.webmanifest'], (req, res) => {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(manifestPath);
  });

  app.get('/sw.js', (req, res) => {
    const swPath = path.join(process.cwd(), 'public', 'sw.js');
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(swPath);
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // Source Code ZIP Download endpoint
  app.get(['/download-zip', '/api/download-zip'], (req, res) => {
    const zipPath = path.join(process.cwd(), 'public', 'resurrection-calculator-source.zip');
    if (fs.existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="resurrection-calculator-source.zip"');
      res.sendFile(zipPath);
    } else {
      res.status(404).send('ZIP file not found. Please generate it first.');
    }
  });

  // Finnhub Stock Quote API
  app.get('/api/quote', async (req, res) => {
    try {
      const rawSymbol = String(req.query.symbol || '').trim();
      if (!rawSymbol) {
        return res.status(400).json({ error: 'Ticker symbol is required (e.g. AAPL, NVDA, TSLA).' });
      }

      const symbol = rawSymbol.toUpperCase();
      const apiKey = process.env.FINNHUB_API_KEY || 'dagh4ghr01quf8muaal0dagh4ghr01quf8muaalg';

      const finnhubQuoteUrl = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`;
      const finnhubProfileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`;

      const [quoteRes, profileRes] = await Promise.all([
        fetch(finnhubQuoteUrl),
        fetch(finnhubProfileUrl).catch(() => null),
      ]);

      if (!quoteRes.ok) {
        return res.status(quoteRes.status).json({
          error: `Finnhub API responded with status ${quoteRes.status}: ${quoteRes.statusText}`,
        });
      }

      const data = (await quoteRes.json()) as {
        c?: number;
        d?: number;
        dp?: number;
        h?: number;
        l?: number;
        o?: number;
        pc?: number;
        t?: number;
      };

      // Finnhub returns all zeros when symbol is invalid or has no data
      if (!data || (data.c === 0 && data.pc === 0 && data.h === 0)) {
        return res.status(404).json({
          error: `No market quote found for "${symbol}". Please check the ticker symbol and try again.`,
        });
      }

      // Resolve Company Full Name
      let companyName = '';
      if (profileRes && profileRes.ok) {
        try {
          const profileData = (await profileRes.json()) as { name?: string };
          if (profileData && profileData.name) {
            companyName = profileData.name;
          }
        } catch {
          // ignore profile parsing errors
        }
      }

      // If company name not found from profile2 (e.g. ETFs or indices), try search
      if (!companyName) {
        try {
          const searchUrl = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(symbol)}&token=${apiKey}`;
          const searchRes = await fetch(searchUrl);
          if (searchRes.ok) {
            const searchData = (await searchRes.json()) as { result?: Array<{ symbol?: string; description?: string }> };
            const match = searchData?.result?.find((r) => r.symbol?.toUpperCase() === symbol);
            if (match?.description) {
              companyName = match.description;
            }
          }
        } catch {
          // ignore search errors
        }
      }

      const KNOWN_NAMES: Record<string, string> = {
        TSLA: 'Tesla, Inc.',
        AAPL: 'Apple Inc.',
        NVDA: 'NVIDIA Corporation',
        AMZN: 'Amazon.com, Inc.',
        MSFT: 'Microsoft Corporation',
        GOOGL: 'Alphabet Inc.',
        GOOG: 'Alphabet Inc.',
        META: 'Meta Platforms, Inc.',
        SPY: 'SPDR S&P 500 ETF Trust',
        QQQ: 'Invesco QQQ Trust',
        AMD: 'Advanced Micro Devices',
      };

      if (!companyName && KNOWN_NAMES[symbol]) {
        companyName = KNOWN_NAMES[symbol];
      }

      return res.json({
        symbol,
        name: companyName || symbol,
        price: Number(data.c ?? 0),
        change: Number(data.d ?? 0),
        percentChange: Number(data.dp ?? 0),
        high: Number(data.h ?? 0),
        low: Number(data.l ?? 0),
        open: Number(data.o ?? 0),
        previousClose: Number(data.pc ?? 0),
        timestamp: (data.t ?? Math.floor(Date.now() / 1000)) * 1000,
      });
    } catch (err: unknown) {
      console.error('Error fetching stock quote:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      return res.status(500).json({ error: `Failed to fetch quote: ${message}` });
    }
  });

  // Finnhub Ticker Search API
  app.get('/api/search', async (req, res) => {
    try {
      const query = String(req.query.q || '').trim();
      if (!query) {
        return res.json({ result: [] });
      }

      const apiKey = process.env.FINNHUB_API_KEY || 'dagh4ghr01quf8muaal0dagh4ghr01quf8muaalg';
      const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`
      );

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Search failed' });
      }

      const data = await response.json();
      return res.json(data);
    } catch (err: unknown) {
      console.error('Error searching symbol:', err);
      return res.status(500).json({ error: 'Failed to search symbols' });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Guard against "[vite] Cannot read properties of undefined (reading 'send')"
    // when HMR is disabled in AI Studio or plugins dispatch hot events in middlewareMode
    const safeHot = {
      send: () => {},
      on: () => {},
      off: () => {},
      listen: () => {},
      close: () => {},
    };
    const clientEnv = (vite as any).environments?.client;
    if (clientEnv && !clientEnv.hot) {
      clientEnv.hot = safeHot;
    }
    if (vite.ws && !vite.ws.send) {
      (vite.ws as any).send = () => {};
    }
    if (!(vite as any).hot) {
      (vite as any).hot = safeHot;
    }

    // Ensure sw.js and html documents are not aggressively cached by client browsers
    app.use((req, res, next) => {
      if (req.path === '/sw.js' || req.path === '/registerSW.js' || req.accepts('html')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      next();
    });

    app.use(vite.middlewares);
    app.use((err: any, req: any, res: any, next: any) => {
      console.error('Server request error:', err);
      if (!res.headersSent) {
        res.status(500).send(err?.message || 'Internal Server Error');
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
