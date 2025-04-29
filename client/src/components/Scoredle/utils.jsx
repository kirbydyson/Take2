export async function validateGuess(word) {
  const response = await fetch('/api/scoredle/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guess: word }),
  });

  if (!response.ok) {
    console.error('Validation API failed');
    return false;
  }

  const data = await response.json();
  return data.valid;
}
