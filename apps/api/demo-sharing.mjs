/**
 * Photo Sharing Demo
 * Shows example share link creation and interactions
 * Run: node demo-sharing.mjs
 */

import {
  generateShareToken,
  generateUrlSlug,
  generateShortCode,
  buildShareUrl,
  getMoodPresentation,
  sanitizeShareLinkForResponse,
} from './utils/shareUtils.js';

import {
  hashPassword,
  validatePasswordStrength,
} from './utils/passwordUtils.js';

console.log('\n🌅 Photo Sharing Demo - Creating Share Links\n');
console.log('='.repeat(70) + '\n');

// ============================================================================
// Demo 1: Public Album Share
// ============================================================================

console.log('📸 DEMO 1: Public Album Share\n');

const publicShare = {
  id: generateShareToken().substring(0, 12),
  ownerId: 'user-123',
  albumId: 'album-456',
  photoId: null,
  token: generateShareToken(),
  urlSlug: generateUrlSlug('summer-memories'),
  shortCode: generateShortCode(),
  recipientEmails: [],
  isPublic: true,
  expiresAt: null,
  isExpired: false,
  isPasswordProtected: false,
  permissions: {
    allowDownload: false,
    allowComments: true,
    allowReactions: true,
    hideExif: false,
  },
  mood: 'mood-celebration',
  season: 'summer',
  colorTint: '#F4A261',
  caption: 'Summer adventures with friends',
  viewCount: 0,
  viewedByEmails: [],
};

const publicUrl = buildShareUrl(publicShare.urlSlug);

console.log('Share Details:');
console.log(`  Title:      Summer Collection`);
console.log(`  Type:       Public Album`);
console.log(`  Mood:       Celebration 🎉`);
console.log(`  Color:      ${publicShare.colorTint}`);
console.log(`  Caption:    "${publicShare.caption}"`);
console.log(`\nShare Link:`);
console.log(`  Short:      ${publicShare.shortCode}`);
console.log(`  Slug:       ${publicShare.urlSlug}`);
console.log(`  URL:        ${publicUrl}`);
console.log(`  Token:      ${publicShare.token.substring(0, 16)}...`);
console.log(`\nPermissions:`);
console.log(`  Download:   ${publicShare.permissions.allowDownload ? '✅' : '❌'}`);
console.log(`  Comments:   ${publicShare.permissions.allowComments ? '✅' : '❌'}`);
console.log(`  Reactions:  ${publicShare.permissions.allowReactions ? '✅' : '❌'}`);
console.log(`  View EXIF:  ${!publicShare.permissions.hideExif ? '✅' : '❌'}`);
console.log(`\nAccess:`);
console.log(`  Public:     ✅ Anyone with link`);
console.log(`  Expires:    Never`);

// ============================================================================
// Demo 2: Password-Protected Photo Share
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('\n📸 DEMO 2: Password-Protected Photo\n');

(async () => {
  const password = 'SoftNostalgia42';
  const strength = validatePasswordStrength(password);
  const passwordHash = await hashPassword(password);

  const protectedShare = {
    id: generateShareToken().substring(0, 12),
    ownerId: 'user-123',
    albumId: null,
    photoId: 'photo-789',
    token: generateShareToken(),
    urlSlug: generateUrlSlug('quiet-moment'),
    shortCode: generateShortCode(),
    recipientEmails: ['friend@example.com'],
    isPublic: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    isExpired: false,
    isPasswordProtected: true,
    passwordHash: passwordHash.substring(0, 20) + '...', // Truncate for display
    passwordHint: 'The mood of this photo',
    permissions: {
      allowDownload: true,
      allowComments: false,
      allowReactions: false,
      hideExif: true,
    },
    mood: 'mood-soft-nostalgia',
    season: 'autumn',
    colorTint: '#A0826D',
    caption: 'A moment I wanted to share with you',
    viewCount: 0,
    viewedByEmails: [],
  };

  const protectedUrl = buildShareUrl(protectedShare.urlSlug);

  console.log('Share Details:');
  console.log(`  Title:      Quiet Moment`);
  console.log(`  Type:       Password-Protected Photo`);
  console.log(`  Mood:       Soft Nostalgia 📸`);
  console.log(`  Color:      ${protectedShare.colorTint}`);
  console.log(`  Caption:    "${protectedShare.caption}"`);
  console.log(`\nShare Link:`);
  console.log(`  Short:      ${protectedShare.shortCode}`);
  console.log(`  Slug:       ${protectedShare.urlSlug}`);
  console.log(`  URL:        ${protectedUrl}`);
  console.log(`\nSecurity:`);
  console.log(`  Password:   ${password}`);
  console.log(`  Hint:       "${protectedShare.passwordHint}"`);
  console.log(`  Valid:      ${strength.isValid ? '✅' : '❌'}`);
  console.log(`  Hash:       ${protectedShare.passwordHash} (stored)`);
  console.log(`\nPermissions:`);
  console.log(`  Download:   ${protectedShare.permissions.allowDownload ? '✅' : '❌'}`);
  console.log(`  Comments:   ${protectedShare.permissions.allowComments ? '✅' : '❌'}`);
  console.log(`  Reactions:  ${protectedShare.permissions.allowReactions ? '✅' : '❌'}`);
  console.log(`  View EXIF:  ${!protectedShare.permissions.hideExif ? '✅' : '❌'}`);
  console.log(`\nAccess:`);
  console.log(`  Recipient:  friend@example.com`);
  console.log(`  Expires:    ${protectedShare.expiresAt.toLocaleDateString()} (30 days)`);

  // ============================================================================
  // Demo 3: Friends-Only Collection
  // ============================================================================

  console.log('\n' + '='.repeat(70));
  console.log('\n📸 DEMO 3: Friends-Only Collection\n');

  const friendsShare = {
    id: generateShareToken().substring(0, 12),
    ownerId: 'user-123',
    albumId: 'collection-999',
    photoId: null,
    token: generateShareToken(),
    urlSlug: generateUrlSlug('cozy-evenings'),
    shortCode: generateShortCode(),
    recipientEmails: [
      'alice@example.com',
      'bob@example.com',
      'charlie@example.com',
    ],
    isPublic: false,
    expiresAt: null,
    isExpired: false,
    isPasswordProtected: false,
    permissions: {
      allowDownload: false,
      allowComments: true,
      allowReactions: true,
      hideExif: false,
    },
    mood: 'mood-quiet-morning',
    season: 'autumn',
    colorTint: '#B8C6DB',
    caption: 'Cozy evenings with loved ones',
    viewCount: 2,
    viewedByEmails: ['alice@example.com', 'charlie@example.com'],
  };

  const friendsUrl = buildShareUrl(friendsShare.urlSlug);

  console.log('Share Details:');
  console.log(`  Title:      Cozy Evenings`);
  console.log(`  Type:       Friends-Only Collection`);
  console.log(`  Mood:       Quiet Morning 🌤️`);
  console.log(`  Color:      ${friendsShare.colorTint}`);
  console.log(`  Caption:    "${friendsShare.caption}"`);
  console.log(`\nShare Link:`);
  console.log(`  Short:      ${friendsShare.shortCode}`);
  console.log(`  Slug:       ${friendsShare.urlSlug}`);
  console.log(`  URL:        ${friendsUrl}`);
  console.log(`\nPermissions:`);
  console.log(`  Download:   ${friendsShare.permissions.allowDownload ? '✅' : '❌'}`);
  console.log(`  Comments:   ${friendsShare.permissions.allowComments ? '✅' : '❌'}`);
  console.log(`  Reactions:  ${friendsShare.permissions.allowReactions ? '✅' : '❌'}`);
  console.log(`  View EXIF:  ${!friendsShare.permissions.hideExif ? '✅' : '❌'}`);
  console.log(`\nAccess:`);
  console.log(`  Recipients: ${friendsShare.recipientEmails.length} friends`);
  friendsShare.recipientEmails.forEach((email) => {
    const viewed = friendsShare.viewedByEmails.includes(email);
    console.log(`    ${viewed ? '✅' : '⏳'} ${email}`);
  });
  console.log(`\nAnalytics:`);
  console.log(`  Total Views: ${friendsShare.viewCount}`);
  console.log(`  Viewed By:   ${friendsShare.viewedByEmails.length} people`);
  console.log(`  Expires:     Never`);

  // ============================================================================
  // Demo 4: Mood Presentation
  // ============================================================================

  console.log('\n' + '='.repeat(70));
  console.log('\n🎨 DEMO 4: Mood Presentation Layer\n');

  const moodTag = {
    id: 'mood-soft-dawn',
    label: 'Soft dawn',
    emoji: '🌅',
    colorTint: '#E8D5B7',
    hexArray: ['#FDF8F3', '#E8D5B7', '#D4AF9B', '#C5A896'],
    season: 'year-round',
    typography: {
      fontStyle: 'serif',
      fontWeight: 'light',
      letterSpacing: '1px',
    },
  };

  const moodPresentation = getMoodPresentation(publicShare, moodTag);

  console.log('Mood: Soft Dawn 🌅\n');
  console.log('Color Palette:');
  moodPresentation.hexArray.forEach((color, idx) => {
    const bar = '█'.repeat(40);
    console.log(
      `  ${color}  ${bar.substring(0, Math.floor(40 * ((idx + 1) / moodPresentation.hexArray.length)))} `
    );
  });
  console.log(`\nTypography:`);
  console.log(`  Family:      ${moodPresentation.typography.fontStyle}`);
  console.log(`  Weight:      ${moodPresentation.typography.fontWeight}`);
  console.log(`  Spacing:     ${moodPresentation.typography.letterSpacing}`);
  console.log(`\nPresentation:  Warm, gentle, contemplative`);

  // ============================================================================
  // Summary
  // ============================================================================

  console.log('\n' + '='.repeat(70));
  console.log('\n✨ Share Link Summary\n');

  console.log('Sharing Options Available:');
  console.log('  ✅ Public links - anyone with URL');
  console.log('  ✅ Friends-only - invite by email');
  console.log('  ✅ Password-protected - add security');
  console.log('  ✅ Expiration dates - time-limited shares');
  console.log(`\nPermissions Control:`);
  console.log('  ✅ Allow/block downloads');
  console.log('  ✅ Allow/block comments & reactions');
  console.log('  ✅ Hide/show EXIF camera data');
  console.log(`\nMood & Presentation:`);
  console.log('  ✅ 4+ system moods with color palettes');
  console.log('  ✅ Seasonal tints (spring, summer, autumn, winter)');
  console.log('  ✅ Custom typography per mood');
  console.log(`\nAnalytics:`);
  console.log('  ✅ View tracking & counting');
  console.log('  ✅ Record who viewed (emails)');
  console.log('  ✅ Last viewed timestamp');

  console.log('\n' + '='.repeat(70) + '\n');
})();
