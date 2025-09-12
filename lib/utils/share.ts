export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export async function shareProduct(shareData: ShareData): Promise<boolean> {
  const { title, text, url } = shareData;

  // Check if Web Share API is supported
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return true;
    } catch (error) {
      // User cancelled or error occurred
      console.log('Share cancelled or failed:', error);
      return false;
    }
  }

  // Fallback: Copy to clipboard
  try {
    const shareText = `${title}\n\n${text}\n\n${url}`;
    await navigator.clipboard.writeText(shareText);
    
    // Show a toast or notification (you can customize this)
    alert('Product link copied to clipboard!');
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    // Final fallback: Show share text in a prompt
    const shareText = `${title}\n\n${text}\n\n${url}`;
    prompt('Copy this link to share:', shareText);
    return false;
  }
}

export function getShareUrl(productId: string, productName: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/products/${productId}`;
}

export function getShareText(productName: string, price?: string): string {
  let text = `Check out this product: ${productName}`;
  if (price) {
    text += ` - ${price}`;
  }
  text += ' on OpenXmart';
  return text;
}
