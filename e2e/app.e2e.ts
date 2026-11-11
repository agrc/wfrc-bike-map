import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://firebase.googleapis.com/**', (route) =>
    route.fulfill({
      json: {
        appId: '1:123456789:web:playwright',
        measurementId: 'G-PLAYWRIGHT',
      },
    }),
  );
  await page.route('https://firebaseinstallations.googleapis.com/**', (route) =>
    route.fulfill({
      json: {
        authToken: {
          expiresIn: '604800s',
          token: 'playwright-test-token',
        },
        fid: 'c123456789012345678901',
        refreshToken: 'playwright-test-refresh-token',
      },
    }),
  );
});

test('shows about information and remembers when it is dismissed', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Utah Bikeways');

  const aboutDialog = page.getByRole('dialog', { name: 'About' });
  await expect(aboutDialog).toBeVisible();
  await expect(aboutDialog).toContainText(
    'Use of this information is at your own risk.',
  );

  const doNotShowAgain = aboutDialog.getByRole('checkbox', {
    name: "Don't show this dialog again",
  });
  await aboutDialog
    .getByText("Don't show this dialog again", {
      exact: true,
    })
    .click();
  await expect(doNotShowAgain).toBeChecked();
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem('showHelpDialogOnLoad')),
    )
    .toBe('true');
  await aboutDialog.getByRole('button', { name: 'Close' }).click();
  await expect(aboutDialog).toBeHidden();

  await page.reload();
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem('showHelpDialogOnLoad')),
    )
    .toBe('true');
  await expect(aboutDialog).toBeHidden();
});

test('mounts the map and shows desktop zoom controls', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('arcgis-map')).toBeAttached();
  await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zoom out' })).toBeVisible();
});

test('preserves route-type filter selections in the URL', async ({ page }) => {
  await page.goto('/');

  const aboutDialog = page.getByRole('dialog', { name: 'About' });
  await aboutDialog.getByRole('button', { name: 'Close' }).click();

  const pavedPath = page.getByRole('checkbox', { name: 'Paved Path' });
  await expect(pavedPath).toBeVisible();
  await expect(pavedPath).toBeChecked();

  await page.getByText('Paved Path', { exact: true }).click();
  await expect(pavedPath).not.toBeChecked();
  await expect
    .poll(() => new URL(page.url()).searchParams.get('routeTypes'))
    .not.toBeNull();

  await page.reload();
  await page
    .getByRole('dialog', { name: 'About' })
    .getByRole('button', { name: 'Close' })
    .click();
  const reloadedPavedPath = page.getByRole('checkbox', { name: 'Paved Path' });
  await expect(reloadedPavedPath).not.toBeChecked();

  await page.getByText('Paved Path', { exact: true }).click();
  await expect(reloadedPavedPath).toBeChecked();
});

test('toggles the Other Links filter checkbox on and off', async ({ page }) => {
  await page.goto('/');

  const aboutDialog = page.getByRole('dialog', { name: 'About' });
  await aboutDialog.getByRole('button', { name: 'Close' }).click();

  const otherLinks = page.getByRole('checkbox', { name: 'Other Links' });
  await expect(otherLinks).toBeChecked();

  await page.getByText('Other Links', { exact: true }).click();
  await expect(otherLinks).not.toBeChecked();
  await expect
    .poll(() => new URL(page.url()).searchParams.get('otherLinks'))
    .toBe('false');

  await page.getByText('Other Links', { exact: true }).click();
  await expect(otherLinks).toBeChecked();
  await expect
    .poll(() => new URL(page.url()).searchParams.get('otherLinks'))
    .toBe('true');
});

test('opens a feature popup and its feedback form without submitting', async ({
  page,
}) => {
  await page.goto('/');

  const aboutDialog = page.getByRole('dialog', { name: 'About' });
  await aboutDialog.getByRole('button', { name: 'Close' }).click();
  await expect(
    page.getByRole('checkbox', { name: 'Paved Path' }),
  ).toBeVisible();

  const map = page.locator('arcgis-map');
  await map.evaluate(async (element) => {
    const mapElement = element as HTMLArcgisMapElement;
    const view = mapElement.view;
    const routeLayer = view.map?.layers.find(
      (layer) => layer.type === 'feature' && layer.title === 'Route Types',
    );

    if (!routeLayer) {
      throw new Error('The Route Types feature layer is not available.');
    }

    const { default: Graphic } =
      await import('/node_modules/@arcgis/core/Graphic.js');
    const graphic = new Graphic({
      geometry: view.center,
      attributes: { OBJECTID: 1, NAME: 'E2E Test Road' },
      layer: routeLayer,
    });

    view.hitTest = async () => {
      return {
        results: [{ type: 'graphic', graphic, layer: routeLayer }],
      };
    };
  });

  const mapBounds = await map.evaluate((element) => {
    const view = (element as HTMLArcgisMapElement).view;
    const bounds = (view.container as HTMLElement).getBoundingClientRect();
    return {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + 150,
    };
  });
  await page.mouse.click(mapBounds.x, mapBounds.y);

  await expect(page.locator('.identify-popup')).toBeVisible();
  const feedbackTrigger = page.getByRole('button', {
    name: 'Give feedback about this road or trail',
  });
  await expect(feedbackTrigger).toBeVisible();
  await feedbackTrigger.click();

  await expect(page.getByLabel('Your email (optional)')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Feedback' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
});
