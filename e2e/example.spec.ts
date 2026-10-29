import { expect, test } from '@playwright/test';

test('home leads learners to the available course catalog', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('link', { name: /Ver las \d+ rutas/i }).click();
  await expect(page).toHaveURL(/\/catalog\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('rutas');
  await expect(page.getByRole('searchbox', { name: /Buscar rutas/i })).toBeVisible();
});

test('catalog search explains zero results and can be reset', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('searchbox', { name: /Buscar rutas/i }).fill('un-tema-inexistente-000');
  await expect(page.getByText(/0 de 6 rutas/i)).toBeVisible();
  await page.getByRole('button', { name: 'Limpiar filtros' }).click();
  await expect(page.getByText(/6 de 6 rutas/i)).toBeVisible();
});

test('real educational plaza exposes lessons without sign-in', async ({ page }) => {
  await page.goto('/plaza');
  await expect(page.getByRole('heading', { level: 1, name: /Tu plaza de aprendizaje/i })).toBeVisible();
  await expect(page.getByLabel('Elige tu objetivo')).toBeVisible();
  await expect(page.getByText('20 unidades evaluables')).toBeVisible();
});

test('small screen keeps the public learning journeys within the viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'Mobile Chrome', 'Mobile-only layout regression');
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(() =>
    document.documentElement.scrollWidth <= window.innerWidth + 2
  )).toBe(true);
  await page.goto('/catalog');
  await expect.poll(() => page.evaluate(() =>
    document.documentElement.scrollWidth <= window.innerWidth + 2
  )).toBe(true);
});
