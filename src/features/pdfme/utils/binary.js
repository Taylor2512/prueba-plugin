export function createObjectUrl(bytes, mimeType) {
  return URL.createObjectURL(new Blob([bytes], { type: mimeType }))
}

export function revokeObjectUrls(urls) {
  urls.forEach((url) => URL.revokeObjectURL(url))
}

export function downloadUrl(url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}
