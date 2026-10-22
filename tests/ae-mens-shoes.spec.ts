import { expect, test, type Locator, type Page } from '@playwright/test';

const categoryUrl =
  (globalThis as typeof globalThis & {
    process?: { env?: { AE_MENS_SHOES_URL?: string } };
  }).process?.env?.AE_MENS_SHOES_URL ??
  'https://www.ae.com/us/en/c/men/shoes/cat4840024';

test('Playwright starts Chromium and opens a page', async ({ page }) => {
  await page.goto('about:blank');
  await expect(page).toHaveURL('about:blank');
});

test.describe("American Eagle men's shoes category @p0", () => {
  test.describe.configure({ mode: 'serial' });
  test.use({
    permissions: ['geolocation'],
    geolocation: {
      // Approximate coordinates for ZIP code 10022 (Midtown Manhattan).
      latitude: 40.7589,
      longitude: -73.9676,
      accuracy: 1000,
    },
  });

  test('AE-MSH-GEO-001 provides the configured ZIP code location', async ({
    page,
  }) => {
    await page.goto(categoryUrl, { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);
    await closeEmailSignupIfPresent(page);

    const position = await page.evaluate(
      () =>
        new Promise<{ latitude: number; longitude: number }>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              ({ coords }) =>
                resolve({
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                }),
              reject,
            );
          },
        ),
    );

    expect(position.latitude).toBeCloseTo(40.7589, 4);
    expect(position.longitude).toBeCloseTo(-73.9676, 4);
  });

  test('AE-MSH-P0-001 @p0 opens the category and displays products', async ({
    page,
  }) => {
    await page.goto(categoryUrl, { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);
    await closeEmailSignupIfPresent(page);

    await expect(
      page.getByRole('heading', { name: "Men's Shoes", exact: true }),
    ).toBeVisible();

    const productTiles = page
      .getByTestId('product-content')
      .locator('[data-test-product-tile]');
    const firstProduct = productTiles.first();

    await expect(firstProduct).toBeVisible();
    await expect(firstProduct.getByRole('heading')).toBeVisible();
    await expect(firstProduct.locator('[data-test-product-prices]')).toContainText(
      /\$\d/,
    );
    await expect(page.getByTestId('filters-title')).toBeVisible();
    await expect(page.locator('[data-test-accordion="Size"]')).toBeEnabled();
  });

  test('AE-MSH-P0-002 @p0 opens the selected product from its card', async ({
    page,
  }) => {
    await page.goto(categoryUrl, { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);
    await closeEmailSignupIfPresent(page);

    const firstProduct = page
      .getByTestId('product-content')
      .locator('[data-test-product-tile]')
      .first();
    const productName = (
      await firstProduct.getByRole('heading').innerText()
    ).trim();
    const productLink = firstProduct.locator('a[href*="/us/en/p/"]');
    const productPath = new URL(
      (await productLink.getAttribute('href')) ?? '',
      categoryUrl,
    ).pathname;

    expect(productName).not.toBe('');
    await productLink.click();

    await expect(page).toHaveURL(new RegExp(escapeRegExp(productPath)));
    await expect(
      page.getByRole('heading', { name: productName, exact: true }),
    ).toBeVisible();
  });

  test('AE-MSH-P0-003 @p0 filters the category by an available size', async ({
    page,
  }) => {
    await page.goto(categoryUrl, { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);
    await closeEmailSignupIfPresent(page);

    const productTiles = page
      .getByTestId('product-content')
      .locator('[data-test-product-tile]');
    const initialProductCount = await productTiles.count();
    expect(initialProductCount).toBeGreaterThan(0);

    await page.locator('[data-test-accordion="Size"]').click();

    const sizePanel = page.getByRole('region', { name: 'Size', exact: true });
    await expect(sizePanel).toBeVisible();

    const sizeOptions = sizePanel.locator(
      'input[type="checkbox"], input[type="radio"]',
    );
    await expect
      .poll(() => sizeOptions.count(), {
        message: 'The size filter should expose at least one available option',
      })
      .toBeGreaterThan(0);

    let availableOption: Locator | undefined;
    const optionCount = await sizeOptions.count();
    for (let index = 0; index < optionCount; index += 1) {
      const option = sizeOptions.nth(index);
      if (await option.isEnabled()) {
        availableOption = option;
        break;
      }
    }

    if (!availableOption) {
      throw new Error('The size filter has no enabled size options');
    }

    await availableOption.check();
    await expect(availableOption).toBeChecked();
    await expect
      .poll(() => productTiles.count(), {
        message: 'The product list should update after applying a size filter',
      })
      .toBeLessThan(initialProductCount);
  });
});

async function acceptCookies(page: Page): Promise<void> {
  const consentDialog = page.getByRole('dialog', {
    name: 'Clarip Cookie Consent Banner',
  });
  if (!(await consentDialog.isVisible({ timeout: 3_000 }).catch(() => false))) {
    return;
  }

  const requestedButton = page.locator('xpath=/html/body/div[2]/div/button');
  const acceptButton =
    (await requestedButton.count()) > 0
      ? requestedButton
      : consentDialog.getByRole('button', { name: 'dismiss cookie message' });

  await acceptButton.click();
  await expect(consentDialog).toBeHidden();
}

async function closeEmailSignupIfPresent(page: Page): Promise<void> {
  const emailSignupForm = page.locator('#emailSignupForm');
  if (!(await emailSignupForm.isVisible())) {
    return;
  }

  const closeButton = page.locator('xpath=//*[@id="modal"]/button');
  await expect(closeButton).toBeVisible();
  await closeButton.click();
  await expect(emailSignupForm).toBeHidden();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
