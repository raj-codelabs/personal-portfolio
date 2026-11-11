#!/usr/bin/env node

/**
 * Deterministic automated feedback loop script for the portfolio application.
 * Exercises:
 *  1. HTTP Server & Public API Contracts
 *  2. Authentication & Admin Authorization Seams
 *  3. Invariant Rules (House Rules, Page Metas, Address Discipline)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 3000;
const HOST = '127.0.0.1';

async function fetchHttp(method, pathName, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = { ...headers };
    if (payload) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      {
        hostname: HOST,
        port: PORT,
        path: pathName,
        method,
        headers: reqHeaders,
        timeout: 4000,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${pathName}`));
    });

    if (payload) req.write(payload);
    req.end();
  });
}

async function runFeedbackLoop() {
  console.log('>>> [PHASE 1 FEEDBACK LOOP] Starting deterministic test assertions...');
  const results = [];

  function assert(condition, message) {
    if (condition) {
      results.push({ pass: true, message });
      console.log(`  [PASS] ${message}`);
    } else {
      results.push({ pass: false, message });
      console.error(`  [FAIL] ${message}`);
    }
  }

  // 1. Health check seam
  try {
    const health = await fetchHttp('GET', '/api/health');
    assert(health.status === 200 && health.data?.status === 'ok', 'GET /api/health responds with status 200 ok');
  } catch (err) {
    assert(false, `GET /api/health connection failed: ${err.message}`);
  }

  // 2. Public portfolio API contract
  try {
    const portfolio = await fetchHttp('GET', '/api/public/portfolio');
    assert(portfolio.status === 200, 'GET /api/public/portfolio returns HTTP 200');
    assert(Boolean(portfolio.data?.profile?.name), 'Portfolio data contains verified profile.name');
    assert(Array.isArray(portfolio.data?.projects) && portfolio.data.projects.length > 0, 'Portfolio data returns published projects array');
    assert(Array.isArray(portfolio.data?.milestones) && portfolio.data.milestones.length > 0, 'Portfolio data returns published milestones');
  } catch (err) {
    assert(false, `GET /api/public/portfolio error: ${err.message}`);
  }

  // 3. Contact message validation seam (Negative + Positive)
  try {
    // 3a. Invalid submission should fail with 400
    const invalidSub = await fetchHttp('POST', '/api/contact/messages', {
      name: '',
      email: 'not-an-email',
      message: 'hi',
    });
    assert(invalidSub.status === 400, 'POST /api/contact/messages rejects invalid payloads with HTTP 400');

    // 3b. Valid submission should succeed with 201
    const validSub = await fetchHttp('POST', '/api/contact/messages', {
      name: 'Automated Harness',
      email: 'harness@testing.example',
      subject: 'Feedback Loop Probe',
      message: 'This is a deterministic verification probe of the inquiry pipeline.',
    });
    assert(validSub.status === 201 && validSub.data?.success === true, 'POST /api/contact/messages logs valid inquiries with HTTP 201');
  } catch (err) {
    assert(false, `Contact messages assertion error: ${err.message}`);
  }

  // 4. Admin auth guard seam
  try {
    const unauthedAdmin = await fetchHttp('GET', '/api/cms/all');
    assert(unauthedAdmin.status === 401, 'GET /api/cms/all rejects unauthenticated requests with HTTP 401');
  } catch (err) {
    assert(false, `Admin auth guard error: ${err.message}`);
  }

  // 5. Invariant Checks on HTML and Source Files
  const indexPath = path.resolve(process.cwd(), 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');

  assert(indexHtml.includes('data-type="software"'), 'index.html declares data-type="software"');
  assert(indexHtml.includes('name="page-type" content="software"'), 'index.html declares meta page-type="software"');
  assert(indexHtml.includes('name="site-kind" content="software"'), 'index.html declares meta site-kind="software"');

  const metaJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'metadata.json'), 'utf-8'));
  assert(indexHtml.includes(`<title>${metaJson.name}</title>`), 'index.html <title> matches metadata.json name exactly');

  const failedCount = results.filter((r) => !r.pass).length;
  console.log(`\n>>> [VERDICT] Completed ${results.length} assertions. Passed: ${results.length - failedCount}, Failed: ${failedCount}`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runFeedbackLoop().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
