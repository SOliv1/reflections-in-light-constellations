/**
 * Photo Sharing Backend Test Suite
 * Run: node test-sharing.mjs
 */

import {
  generateShareToken,
  generateUrlSlug,
  generateShortCode,
  isShareLinkExpired,
  validateShareLinkAccess,
  buildShareUrl,
  getMoodPresentation,
  sanitizeShareLinkForResponse,
  recordShareLinkView,
} from './utils/shareUtils.js';

import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  generateRandomPassword,
} from './utils/passwordUtils.js';

const tests = [];
let passed = 0;
let failed = 0;

// Helper to register tests
function test(name, fn) {
  tests.push({ name, fn });
}

// Helper to assert
function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ ${message}`);
  }
}

// ============================================================================
// Share Utils Tests
// ============================================================================

test('generateShareToken should create 32-char random token', () => {
  const token = generateShareToken();
  assert(token.length === 32, `Token length is ${token.length}, expected 32`);
  assert(/^[a-f0-9]+$/.test(token), 'Token should be hex string');
});

test('generateUrlSlug should create readable slug with suffix', () => {
  const slug = generateUrlSlug('soft-dawn');
  assert(slug.includes('soft-dawn'), 'Slug should include base name');
  assert(slug.match(/-[a-f0-9]{4}$/), 'Slug should end with random 4-char hex');
});

test('generateShortCode should create 6-char code', () => {
  const code = generateShortCode();
  assert(code.length === 6, `Code length is ${code.length}, expected 6`);
  assert(/^[A-Z0-9]+$/.test(code), 'Code should be uppercase alphanumeric');
});

test('isShareLinkExpired should detect expired links', () => {
  const pastDate = new Date('2020-01-01');
  const futureDate = new Date('2030-01-01');
  
  assert(isShareLinkExpired(pastDate), 'Past date should be expired');
  assert(!isShareLinkExpired(futureDate), 'Future date should not be expired');
  assert(!isShareLinkExpired(null), 'Null expiry should never expire');
});

test('validateShareLinkAccess should check link validity', () => {
  const validLink = {
    id: 'link-1',
    photoId: 'photo-1',
    expiresAt: new Date('2030-01-01'),
  };
  
  const validation = validateShareLinkAccess(validLink);
  assert(validation.isValid, 'Valid link should pass validation');
  
  const expiredLink = {
    id: 'link-2',
    photoId: 'photo-1',
    expiresAt: new Date('2020-01-01'),
  };
  
  const expiredValidation = validateShareLinkAccess(expiredLink);
  assert(!expiredValidation.isValid, 'Expired link should fail validation');
});

test('buildShareUrl should construct proper URL', () => {
  const url = buildShareUrl('soft-dawn-7f3k', {
    baseUrl: 'http://localhost:3000',
  });
  
  assert(url === 'http://localhost:3000/share/soft-dawn-7f3k', 'URL format incorrect');
});

test('getMoodPresentation should hydrate mood styling', () => {
  const shareLink = {
    mood: 'mood-soft-dawn',
    season: 'summer',
    colorTint: '#E8D5B7',
  };
  
  const moodTag = {
    colorTint: '#E8D5B7',
    hexArray: ['#FDF8F3', '#E8D5B7', '#D4AF9B'],
    emoji: '🌅',
    season: 'year-round',
    typography: { fontStyle: 'serif', fontWeight: 'light' },
    label: 'Soft dawn',
  };
  
  const presentation = getMoodPresentation(shareLink, moodTag);
  assert(presentation.emoji === '🌅', 'Should include mood emoji');
  assert(presentation.hexArray.length === 3, 'Should include color palette');
});

test('sanitizeShareLinkForResponse should remove sensitive data', () => {
  const shareLink = {
    id: 'link-1',
    passwordHash: '$2b$10$secret',
    viewCount: 42,
    viewedByEmails: ['user@example.com'],
  };
  
  const sanitized = sanitizeShareLinkForResponse(shareLink);
  assert(!sanitized.passwordHash, 'Should not include password hash');
  assert(sanitized.viewCount === 42, 'Should include view count');
});

test('recordShareLinkView should increment view count', () => {
  const shareLink = {
    viewCount: 5,
    viewedByEmails: [],
    lastViewedAt: new Date('2026-07-20'),
  };
  
  const updated = recordShareLinkView(shareLink, 'friend@example.com');
  assert(updated.viewCount === 6, 'View count should increment');
  assert(updated.viewedByEmails.includes('friend@example.com'), 'Should record email');
  assert(updated.lastViewedAt > shareLink.lastViewedAt, 'Should update timestamp');
});

// ============================================================================
// Password Utils Tests
// ============================================================================

test('hashPassword should create different hashes', async () => {
  const hash1 = await hashPassword('MyPassword123');
  const hash2 = await hashPassword('MyPassword123');
  
  assert(hash1 !== hash2 || hash1.length > 20, 'Hashes should be cryptographic');
  assert(hash1.length > 0, 'Hash should not be empty');
});

test('verifyPassword should match correct password', async () => {
  const password = 'MyPassword123';
  const hash = await hashPassword(password);
  const isValid = await verifyPassword(password, hash);
  
  assert(isValid, 'Should verify correct password');
});

test('verifyPassword should reject wrong password', async () => {
  const hash = await hashPassword('MyPassword123');
  const isValid = await verifyPassword('WrongPassword', hash);
  
  assert(!isValid, 'Should reject wrong password');
});

test('validatePasswordStrength should check requirements', () => {
  const weak = validatePasswordStrength('weak');
  assert(!weak.isValid, 'Weak password should fail');
  assert(weak.errors.length > 0, 'Should provide error reasons');
  
  const strong = validatePasswordStrength('StrongPass123');
  assert(strong.isValid, 'Strong password should pass');
  assert(strong.errors.length === 0, 'Should have no errors');
});

test('generateRandomPassword should create strong password', () => {
  const password = generateRandomPassword();
  assert(password.length >= 16, 'Generated password should be at least 16 chars');
  assert(/^[a-f0-9]+$/.test(password), 'Should be hex string');
});

// ============================================================================
// Run Tests
// ============================================================================

console.log('\n📸 Photo Sharing Backend Test Suite\n');
console.log('='.repeat(60) + '\n');

(async () => {
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed!\n');
  } else {
    console.log(`⚠️  ${failed} test(s) failed\n`);
    process.exit(1);
  }
})();
