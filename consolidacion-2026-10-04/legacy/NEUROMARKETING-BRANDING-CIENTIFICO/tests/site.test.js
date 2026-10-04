const { describe, it, expect } = require('vitest');
const fs = require('fs');
const path = require('path');

describe('Neuromarketing site', () => {
  it('has index.html', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'index.html'))).toBe(true);
  });

  it('has documento_principal.html', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'documento_principal.html'))).toBe(true);
  });

  it('has package.json', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    expect(pkg.name).toBe('neuromarketing-branding-cientifico');
  });
});
