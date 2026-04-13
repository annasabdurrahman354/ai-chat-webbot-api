import { chromium } from 'playwright';
import type { Browser } from 'playwright';

// Keep track of all active browser instances to allow global termination
const activeBrowsers: Set<Browser> = new Set();

export async function sendMessage(url: string | undefined = process.env.TARGET_URL, message: string = 'Hello World', webSearch: boolean = false, plainText: boolean = true): Promise<{ status: string, title?: string, response?: string, error?: string }> {
  // Return error immediately if URL is not configured
  if (!url) {
    return { status: 'error', error: 'TARGET_URL environment variable is missing or undefined.' };
  }

  // Use local variables so each API call gets its own isolated session
  let localBrowser: Browser | null = null;
  
  try {
    console.log('Launching new isolated browser instance...');
    localBrowser = await chromium.launch({
      headless: true,
    });
    
    // Register this instance to the global tracker
    activeBrowsers.add(localBrowser);
    
    const context = await localBrowser.newContext();
    const activePage = await context.newPage();
    
    await activePage.goto(url);
    const title = await activePage.title();
    
    console.log(`Successfully opened: ${title}`);
    
    // Click the button containing a span with text "Diffusion Effect"
    await activePage.locator('button', { has: activePage.locator('span', { hasText: 'Diffusion Effect' }) }).click();
    console.log('Clicked "Diffusion Effect" button');
    
    if (!webSearch) {
      await activePage.locator('button[title="Web search enabled"]').click();
      console.log('Disabled Web Search by clicking button with title "Web search enabled"');
    }
    
    // Fill the message textarea
    await activePage.getByPlaceholder('How can I help you?').fill(message);
    console.log(`Filled message in textarea: "${message}"`);
    
    // Click the submit button
    await activePage.locator('button[type="submit"]').click();
    console.log('Clicked submit button');
    
    console.log('Waiting for response...');

    await activePage.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {
      throw new Error('Bot response timeout: Page did not reach idle state within 20 seconds.');
    });
    
    // Get the last chat message which has class "prose-chat"
    let responseText;
    if (plainText) {
      // innerText natively removes HTML tags and preserves visual line breaks perfectly
      responseText = await activePage.locator('.prose-chat').last().innerText();
    } else {
      responseText = await activePage.locator('.prose-chat').last().innerHTML();
    }
    
    console.log('\n--- Bot Response ---');
    console.log(responseText);
    console.log('--------------------\n');
    
    return { status: 'success', title, response: responseText };
  } catch (error) {
    console.error(`Error in bot execution: ${error}`);
    return { status: 'error' };
  } finally {
    console.log('Cleaning up: Closing local browser instance...');
    // Always close the browser when done to free up memory
    if (localBrowser) {
      await localBrowser.close().catch(() => {}); // Catch safely in case it's already closed
      activeBrowsers.delete(localBrowser); // Remove from tracking list
    }
  }
}

// Global kill switch to terminate ALL active browsers currently running
export async function stopBot() {
  const browserCount = activeBrowsers.size;
  if (browserCount > 0) {
    console.log(`Force terminating ${browserCount} active browser(s)...`);
    const closePromises = Array.from(activeBrowsers).map(browser => browser.close().catch(() => {}));
    await Promise.all(closePromises);
    activeBrowsers.clear();
    return { status: `terminated-${browserCount}-browsers` };
  }
  return { status: 'no-active-browsers' };
}
