export default function handler(req, res) {
  const { guess } = req.body;

  const isValid =
    typeof guess === 'string' &&
    guess.length === 5 &&
    /^[a-zA-Z]{5}$/.test(guess);

  res.status(200).json({ valid: isValid });
}
